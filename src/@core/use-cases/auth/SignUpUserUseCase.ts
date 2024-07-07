// import { IUseCase } from '@/@core/interfaces/handlers'
// import { IUsersService } from '@/@core/interfaces/services'

// type Request = {
//   userId: string
// }

// export class SignUpUserUseCase implements IUseCase<Request, void> {
//   constructor(private usersService: IUsersService) {}

//   async do({ userId }: Request) {
//     const response = await this.usersService.getUserEmailById(userId)

//     if (response.isSuccess) return

//   }
// }
