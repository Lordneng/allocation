import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';
import { PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Generated } from 'typeorm';

export abstract class Entity<T> {
    @ApiProperty({ type: String, required: false })
    @PrimaryGeneratedColumn('uuid')
    id: T;
}

export abstract class NamedEntity<T> extends Entity<T> {
    @Column({ nullable: false })
    Nombre: string;
}

export abstract class CreatedEntity<T> extends Entity<T> {
    @ApiProperty({ required: false })
    @Column({ nullable: true })
    rowOrder: Number;

    @ApiProperty({ required: false })
    @Column({ nullable: true, length: "MAX" })
    remark: String;

    @ApiProperty({ required: false, maxLength: 200 })
    @Column({ nullable: true, length: 200 })
    activeStatus: String;

    @Column({ nullable:true  })
    @Generated("uuid")
    createByUserId: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    createBy: String;

    @ApiProperty({ required: false })
    @CreateDateColumn()
    createDate: Date;

    @Column({ nullable:true  })
    @Generated("uuid")
    updateByUserId: string;

    @ApiProperty({ required: false })
    @Column({ nullable: true })
    updateBy: String;

    @ApiProperty({ required: false })
    @UpdateDateColumn()
    updateDate: Date;
}