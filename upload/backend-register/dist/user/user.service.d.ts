import { CreateForgotPassDto, CreateLoginDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
export declare class UserService {
    private userRepository;
    constructor(userRepository: Repository<User>);
    register(name: string, email: string, password: string): Promise<"Check your mail to verfiy yourself" | "Your email was already registered, now you have to verify yourself by clicking the link which is sent to your mail" | "you are already a registered user, don't try to register again">;
    verifySignUpToken(token: string): Promise<User>;
    verifyResetPassToken(data: any): Promise<User>;
    loginUser(data: CreateLoginDto): Promise<{
        val: string;
        login: boolean;
    }>;
    forgotPass(data: CreateForgotPassDto): Promise<"Check your email to reset password" | {
        val: string;
    }>;
}
