import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { IUser } from 'src/user/interface/user.interface';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(dto: CreatePaymentDto, user: IUser): Promise<{
        payUrl: any;
    }>;
    handleMomoRedirect(query: any, res: any): Promise<any>;
}
