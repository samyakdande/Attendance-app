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
        name: string;
        type: string | null;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    findAll(): Promise<{
        id: string;
        name: string;
        type: string | null;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        type: string | null;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    update(id: string, updateInstitutionDto: {
        name?: string;
        type?: string;
        status?: string;
        settings?: any;
    }): Promise<{
        id: string;
        name: string;
        type: string | null;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
    remove(id: string): Promise<{
        id: string;
        name: string;
        type: string | null;
        status: string;
        settings: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
