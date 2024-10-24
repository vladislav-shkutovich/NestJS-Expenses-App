import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { MongooseModule } from '@nestjs/mongoose'

import { AccountModule } from './account/account.module'
import { AuthModule } from './auth/auth.module'
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard'
import { CategoryModule } from './category/category.module'
import { throwMissingEnvVar } from './common/utils/env.utils'
import { CurrencyModule } from './currency/currency.module'
import { ExchangeRateModule } from './exchange-rate/exchange-rate.module'
import { OperationModule } from './operation/operation.module'
import { SummaryModule } from './summary/summary.module'
import { TransferModule } from './transfer/transfer.module'
import { UserModule } from './user/user.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri:
          configService.get<string>('MONGODB_URI') ||
          throwMissingEnvVar('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    AccountModule,
    CurrencyModule,
    ExchangeRateModule,
    TransferModule,
    OperationModule,
    CategoryModule,
    SummaryModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
