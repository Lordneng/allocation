import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../common/providers';
import { SignatureController } from './signature.controller';
import { SignatureProvider } from './signature.provider';
import { SignatureService } from './signature.service';
import { IsSignatureAlreadyExist } from './validateFillter/IsSignatureAlreadyExist';


@Module({
    imports: [DatabaseModule],
    controllers: [SignatureController],
    providers: [...SignatureProvider, IsSignatureAlreadyExist, SignatureService],
    exports:[SignatureService]
})
export class SignatureModule {}