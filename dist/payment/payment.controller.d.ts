import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { IUser } from 'src/user/interface/user.interface';
import { ConfigService } from '@nestjs/config';
export declare class PaymentController {
    private readonly paymentService;
    private readonly configService;
    constructor(paymentService: PaymentService, configService: ConfigService);
    create(dto: CreatePaymentDto, user: IUser): Promise<{
        payUrl: any;
    }>;
    handleMomoRedirect(query: any, res: any): Promise<any>;
}
