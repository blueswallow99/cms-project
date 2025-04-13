import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
//TODO: import orderEntety after creating it
// import { OrderEntity } from './order.entity';

@Entity('customers')
export class CustomerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  passwordHash: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  //TODO: add the relation to order entity after creation. fix the place holder
//   @OneToMany(() => ...)
//   orders: OrderEntity[];
}