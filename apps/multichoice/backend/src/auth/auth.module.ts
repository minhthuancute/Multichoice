import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import configuration from "../config/configuration";
import { User } from "../user/entities/user.entity";
import { authController } from "./auth.controller";
import { authService } from "./auth.service";
import { LocalStrategy } from "./strategies/local.strategy";

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), JwtModule.register({
            secret: configuration().jwt_key,
            signOptions: { expiresIn: '1d' }
        })
        , PassportModule],
    controllers: [authController],
    providers: [authService, LocalStrategy]
})
export class AuthModule { }