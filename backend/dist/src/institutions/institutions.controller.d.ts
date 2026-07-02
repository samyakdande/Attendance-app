import { InstitutionsService } from './institutions.service';
export declare class InstitutionsController {
    private readonly institutionsService;
    constructor(institutionsService: InstitutionsService);
    create(createInstitutionDto: {
        name: string;
        type?: string;
        settings?: any;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    findAll(): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    update(id: string, updateInstitutionDto: {
        name?: string;
        type?: string;
        status?: string;
        settings?: any;
    }): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        status: string;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
        name: string;
        type: string | null;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
    }>;
}
