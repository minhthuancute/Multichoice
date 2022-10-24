import { Controller, Get } from '@nestjs/common';
import { FirebaseService } from './firebase.service';

@Controller()
export class firebaseController {
  constructor(private readonly firebaseServise: FirebaseService) {}
  @Get('firebase/test')
  async tesst(): Promise<any> {
    const a = this.firebaseServise.fireGet(
      'test-62242c76-e3d1-4eb8-a903-ee6fa848cc45',
      (data) => {
        console.log(data);
      }
    );
  }
}
