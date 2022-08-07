import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "../config/configuration";
import { User } from "../user/entities/user.entity";
import { authController } from "./auth.controller";
import { authService } from "./auth.servise";

@Module({
    imports: [TypeOrmModule.forFeature([User]), JwtModule.register({
        secret: configuration().JWT_KEY,
        signOptions: { expiresIn: '1d' }
    })],
    controllers: [authController],
    providers: [authService],
})
export class authModule { }