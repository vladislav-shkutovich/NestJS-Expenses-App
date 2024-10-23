import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'

import { OPERATION_MODEL } from '../common/constants/database.constants'
import type { Operation } from './schemas/operation.schema'

@Injectable()
export class OperationDatabaseService {
  constructor(
    @InjectModel(OPERATION_MODEL) private operationModel: Model<Operation>,
  ) {}
}
