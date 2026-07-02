import { AcademicYearsService } from './academic-years.service';
export declare class AcademicYearsController {
    private readonly academicYearsService;
    constructor(academicYearsService: AcademicYearsService);
    create(user: any, data: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        institutionId: string;
        name: string;
        startDate: Date;
        endDate: Date;
    }>;
    findAll(user: any): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        institutionId: string;
        name: string;
        startDate: Date;
        endDate: Date;
    }[]>;
}
