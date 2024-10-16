import { UserService } from './user.service';
import { CreateForgotPassDto, CreateLoginDto, CreateUserDto } from './dto/create-user.dto';
import { Response, Request } from 'express';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    register(createUserDto: CreateUserDto, res: Response): Promise<Response<any, Record<string, any>>>;
    verifyToken(token: any, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    signinUser(data: CreateLoginDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    forgotPass(data: CreateForgotPassDto, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
    verifyResetPassToken(data: any, res: Response, req: Request): Promise<Response<any, Record<string, any>>>;
}
