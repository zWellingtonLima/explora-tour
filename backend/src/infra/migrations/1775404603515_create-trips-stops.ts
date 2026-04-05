import { MigrationBuilder } from "node-pg-migrate";
import type { ColumnDefinitions } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createTable("trip_stops", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("gen_random_uuid()"),
    },
    trip_id: {
      type: "uuid",
      notNull: true,
      references: '"trips"',
      onDelete: "CASCADE",
    },
    city: {
      type: "varchar(255)",
      notNull: true,
    },
    /*
     * address: morada completa ou ponto de referência.
     * Exemplo: "Terminal Rodoviário de Lisboa, Av. Casal Ribeiro"
     * Opcional — para algumas paragens pode ser só a cidade.
     */
    address: {
      type: "text",
    },
    /*
     * order_index: define a ordem das paragens na viagem.
     * Convenção:
     *   0         → origem  (stop_type = 'origin')
     *   1, 2, ... → paragens intermédias (stop_type = 'intermediate')
     *   N (maior) → destino  (stop_type = 'destination')
     *
     * UNIQUE (trip_id, order_index) garante que não há dois stops
     * na mesma posição da mesma viagem.
     */
    order_index: {
      type: "integer",
      notNull: true,
    },
    stop_type: {
      type: "varchar(20)",
      notNull: true,
    },
    estimated_arrival_at: {
      type: "timestamptz",
    },
    /*
     * price_from_origin: preço do segmento desde a origem até esta paragem.
     * NULL = usa o price_per_seat da trip (preço fixo independente do segmento).
     * Quando preenchido, permite que um viajante que embarca a meio
     * pague menos que o preço completo.
     *
     * Exemplo numa van de turismo Porto → Coimbra → Lisboa:
     *   Porto (origin):      price_from_origin = NULL (ponto de partida)
     *   Coimbra (intermed.): price_from_origin = 8.00 €
     *   Lisboa (dest.):      price_from_origin = 15.00 € (preço total)
     *
     * O preço de um booking = alighting_stop.price_from_origin
     *                        - boarding_stop.price_from_origin
     *   (ou trip.price_per_seat se ambos forem NULL)
     */
    price_from_origin: {
      type: "numeric(10,2)",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint(
    "trip_stops",
    "trip_stops_type_check",
    `CHECK (stop_type IN ('origin', 'intermediate', 'destination'))`,
  );

  pgm.addConstraint(
    "trip_stops",
    "trip_stops_order_index_check",
    "CHECK (order_index >= 0)",
  );

  pgm.addConstraint(
    "trip_stops",
    "trip_stops_price_check",
    "CHECK (price_from_origin IS NULL OR price_from_origin >= 0)",
  );

  /* Garante unicidade da posição dentro de uma viagem */
  pgm.addIndex("trip_stops", ["trip_id", "order_index"], { unique: true });

  pgm.addIndex("trip_stops", ["trip_id", "stop_type"]);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropTable("trip_stops", { cascade: true });
}
