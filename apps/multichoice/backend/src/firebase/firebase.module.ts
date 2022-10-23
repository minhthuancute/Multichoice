import { Module } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

import { firebaseController } from './firebaseController';

@Module({
  providers: [FirebaseService],
  controllers: [firebaseController],
  exports: [FirebaseService],
})
export class firebaseModule {}
