import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("auth_tokens", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    user_id: {
      type: "varchar(26)",
      notNull: true,
      references: '"users"',
      onDelete: "CASCADE",
    },
    /*
     * Armazenamos o SHA-256 do token, nunca o token em plaintext.
     * O link enviado por email contém o token original.
     * Na validação: hash(token_recebido) === token_hash guardado.
     * Assim, mesmo que a base de dados seja comprometida, os tokens são inúteis.
     */
    token_hash: {
      type: "varchar(64)",
      notNull: true,
    },
    /*
     * type: 'email_verification' | 'password_reset'
     * Uma única tabela serve os dois fluxos — a diferença está na expiração
     * e no comportamento do endpoint que consome o token.
     */
    type: {
      type: "varchar(30)",
      notNull: true,
    },
    expires_at: {
      type: "timestamptz",
      notNull: true,
    },
    /*
     * used_at: NULL = token ainda válido e não utilizado.
     * Ao consumir o token, preenchemos este campo em vez de apagar o registo,
     * mantendo auditoria de quando e quantas vezes tentaram usar o token.
     */
    used_at: {
      type: "timestamptz",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "auth_tokens",
    "auth_tokens_type_check",
    `CHECK (type IN ('email_verification', 'password_reset'))`,
  );

  /*
   * Índice no token_hash: é a coluna pesquisada em cada validação de link.
   * Unique garante que dois tokens diferentes não produzem o mesmo hash
   * (colisão improvável com SHA-256, mas melhor garantir).
   */
  pgm.addIndex("auth_tokens", ["token_hash"], { unique: true });

  /*
   * Índice composto para encontrar tokens pendentes de um utilizador:
   * usado no "reenviar email de verificação" para invalidar o anterior.
   */
  pgm.addIndex("auth_tokens", ["user_id", "type", "used_at"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("auth_tokens", { cascade: true });
}
