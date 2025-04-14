import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1744626194149 implements MigrationInterface {
  name = 'InitialSchema1744626194149';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS customers (
            id UUID PRIMARY KEY,
            email VARCHAR(255) NOT NULL UNIQUE,
            firstName VARCHAR(255) NOT NULL,
            lastName VARCHAR(255) NOT NULL,
            passwordHash VARCHAR(255) NOT NULL,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          )
        `);

    await queryRunner.query(`
          CREATE TYPE order_status AS ENUM ('PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED');
          
          CREATE TABLE IF NOT EXISTS orders (
            id UUID PRIMARY KEY,
            customerId UUID NOT NULL,
            totalAmount DECIMAL(10,2) NOT NULL,
            status order_status DEFAULT 'PENDING',
            paymentId VARCHAR(255),
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            CONSTRAINT fk_customer FOREIGN KEY (customerId) REFERENCES customers (id)
          )
        `);

    await queryRunner.query(`
          CREATE TABLE IF NOT EXISTS order_items (
            id UUID PRIMARY KEY,
            orderId UUID NOT NULL,
            productId VARCHAR(255) NOT NULL,
            name VARCHAR(255) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            quantity INT NOT NULL,
            CONSTRAINT fk_order FOREIGN KEY (orderId) REFERENCES orders (id)
          )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS order_items`);
    await queryRunner.query(`DROP TABLE IF EXISTS orders`);
    await queryRunner.query(`DROP TYPE IF EXISTS order_status`);
    await queryRunner.query(`DROP TABLE IF EXISTS customers`);
  }
}
