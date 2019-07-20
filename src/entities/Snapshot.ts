import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export default class Snapshot {
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    @CreateDateColumn()
    public date: Date;

    @Column()
    public channel: string;

    @Column()
    public count: number;

    public constructor(channel: string, count: number) {
        this.channel = channel;
        this.count = count;
    }
}
