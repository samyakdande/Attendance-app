import { ParentsService } from './parents.service';
export declare class ParentsController {
    private readonly parentsService;
    constructor(parentsService: ParentsService);
    findAll(user: any): Promise<({
        students: ({
            student: {
                id: string;
                status: string;
                createdAt: Date;
                updatedAt: Date;
                deletedAt: Date | null;
                firstName: string;
                lastName: string;
                email: string | null;
                phone: string | null;
                institutionId: string;
                enrollmentNumber: string;
                qrIdentifier: string;
                qrStatus: string;
                qrVersion: number;
                lastQrGeneratedAt: Date | null;
            };
        } & {
            createdAt: Date;
            studentId: string;
            parentId: string;
            relation: string;
        })[];
        profile: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
            role: string;
            firstName: string;
            lastName: string;
            email: string;
            phone: string | null;
            institutionId: string;
        };
    } & {
        id: string;
        status: string;
        createdAt: Date;
        profileId: string;
        institutionId: string;
    })[]>;
}
