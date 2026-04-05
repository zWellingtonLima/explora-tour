import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("notifications", {
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
     * type: identifica o evento que gerou a notificação.
     * Usado pelo frontend para renderizar o ícone e a ação correta.
     *
     * Tipos disponíveis:
     *   booking_confirmed      → viajante: reserva confirmada pelo condutor
     *   booking_cancelled      → viajante: reserva cancelada
     *   booking_expired        → viajante: reserva expirou sem confirmação
     *   booking_new            → condutor: nova reserva aguarda confirmação
     *   payment_confirmed      → viajante: pagamento confirmado
     *   payment_rejected       → viajante: pagamento rejeitado
     *   trip_cancelled         → viajante: viagem cancelada pelo condutor
     *   trip_reminder          → viajante/condutor: lembrete 24h antes
     *   review_request         → viajante/condutor: pedir avaliação pós-viagem
     *   email_verification     → utilizador: reenvio de link de verificação
     *   password_reset         → utilizador: link de recuperação de senha
     */
    type: {
      type: "varchar(50)",
      notNull: true,
    },
    title: {
      type: "varchar(255)",
      notNull: true,
    },
    body: {
      type: "text",
      notNull: true,
    },
    /*
     * metadata: dados adicionais estruturados para o frontend.
     * Permite que o cliente construa deep-links sem fazer queries extras.
     *
     * Exemplos por tipo:
     *   booking_confirmed: { "booking_id": "...", "trip_id": "...", "seat": "A1" }
     *   trip_cancelled:    { "trip_id": "...", "departure_at": "2024-06-15T09:00:00Z" }
     *   review_request:    { "booking_id": "...", "reviewed_name": "João Silva" }
     */
    metadata: {
      type: "jsonb",
      notNull: true,
      default: pgm.func(`'{}'::jsonb`),
    },
    /*
     * read_at: NULL = não lida.
     * O frontend pode filtrar notificações não lidas:
     *   WHERE user_id = $1 AND read_at IS NULL
     */
    read_at: {
      type: "timestamptz",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "notifications",
    "notifications_type_check",
    `CHECK (type IN (
      'booking_confirmed', 'booking_cancelled', 'booking_expired', 'booking_new',
      'payment_confirmed', 'payment_rejected',
      'trip_cancelled', 'trip_reminder',
      'review_request',
      'email_verification', 'password_reset'
    ))`,
  );

  /* Índice para feed de notificações do utilizador (mais recente primeiro) */
  pgm.addIndex("notifications", ["user_id", "created_at"]);

  /* Índice para contagem de não lidas (operação frequente no header da app) */
  pgm.addIndex("notifications", ["user_id", "read_at"], {
    where: "read_at IS NULL",
    name: "notifications_unread_idx",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("notifications", { cascade: true });
}
