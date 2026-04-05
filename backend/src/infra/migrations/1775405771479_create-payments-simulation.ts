import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("payment_simulations", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    /*
     * UNIQUE em booking_id: relação 1-para-1 com bookings.
     * Uma reserva tem exactamente uma simulação de pagamento.
     * Se no futuro migrarmos para um gateway real (Stripe, etc.),
     * esta tabela pode ser substituída por uma tabela de transactions
     * sem alterar bookings.
     */
    booking_id: {
      type: "uuid",
      notNull: true,
      unique: true,
      references: '"bookings"',
      onDelete: "CASCADE",
    },
    amount: {
      type: "numeric(10,2)",
      notNull: true,
    },
    /*
     * payment_method: métodos de pagamento.
     *   mbway               → chave telefónica (ex: +351 912 345 678)
     *   multibanco          → entidade + referência + valor
     *   transferencia_bancaria → IBAN + nome do titular
     *   cartao_debito       → pagamento presencial
     *   cartao_credito      → pagamento presencial
     *   dinheiro            → pagamento em espécie no embarque
     */
    payment_method: {
      type: "varchar(30)",
      notNull: true,
    },
    /*
     * payment_instructions: texto livre que aparece ao viajante após a reserva.
     * O condutor preenche no perfil ou por viagem.
     *
     * Exemplos por método:
     *   MBWay:                "Envie para +351 912 345 678 (João Silva)"
     *   Multibanco:           "Entidade: 21234 | Ref: 123 456 789 | Valor: 75,00 €"
     *   Transferência:        "IBAN: PT50 0000 0000 0000 0000 0000 0 | Titular: João Silva"
     *   Dinheiro/cartão:      "Pague durante o embarque"
     */
    payment_instructions: {
      type: "text",
    },
    /*
     * status — ciclo de vida do pagamento simulado:
     *   awaiting_confirmation → aguarda que o condutor confirme recepção
     *   confirmed             → condutor confirmou, booking passa a 'confirmed'
     *   rejected              → condutor rejeitou (pagamento não recebido)
     *   refunded              → condutor cancelou viagem após confirmar pagamento
     */
    status: {
      type: "varchar(25)",
      notNull: true,
      default: "awaiting_confirmation",
    },
    /*
     * driver_notes: campo livre para o condutor registar observações.
     * Útil para auditoria — ex: "Recebi via MBWay às 14:32, referência XYZ".
     */
    driver_notes: {
      type: "text",
    },
    confirmed_by: {
      type: "varchar(26)",
      references: '"users"',
      onDelete: "SET NULL",
    },
    confirmed_at: {
      type: "timestamptz",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "payment_simulations",
    "payment_simulations_method_check",
    `CHECK (payment_method IN (
      'mbway', 'multibanco', 'transferencia_bancaria',
      'cartao_debito', 'cartao_credito', 'dinheiro'
    ))`,
  );

  pgm.addConstraint(
    "payment_simulations",
    "payment_simulations_status_check",
    `CHECK (status IN ('awaiting_confirmation', 'confirmed', 'rejected', 'refunded'))`,
  );

  pgm.addConstraint(
    "payment_simulations",
    "payment_simulations_amount_check",
    "CHECK (amount > 0)",
  );

  /*
   * confirmed_at deve estar preenchido quando status = 'confirmed'.
   * Validação de consistência ao nível da base de dados.
   */
  pgm.addConstraint(
    "payment_simulations",
    "payment_simulations_confirmed_consistency_check",
    `CHECK (
      (status = 'confirmed' AND confirmed_at IS NOT NULL AND confirmed_by IS NOT NULL)
      OR status <> 'confirmed'
    )`,
  );

  pgm.sql(`
    CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON payment_simulations
    FOR EACH ROW EXECUTE FUNCTION trigger_set_updated_at();
  `);

  pgm.addIndex("payment_simulations", ["status"], {
    where: `status = 'awaiting_confirmation'`,
    name: "payment_simulations_pending_idx",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("payment_simulations", { cascade: true });
}
