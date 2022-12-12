import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class firebaseController {
  constructor(private readonly firebaseServise: FirebaseService) {}
}
