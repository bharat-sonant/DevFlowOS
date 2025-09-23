// packages/shared/src/index.ts

// Re-export everything for easy imports
export * from './models/companies/dto/create-companies.dto';
export * from './models/companies/dto/update-companies.dto';
export * from './models/companies/dto/companies.response.dto';
export * from './models/companies/entities/companies.entity';

export * from './models/users/dto/create-users.dto';
export * from './models/users/dto/update-users.dto';
export * from './models/users/dto/users.response.dto';
export * from './models/users/entities/users.entity';
export * from './models/users/dto/invite-user.dto';
export * from './models/users/dto/validate-invite.dto';

export * from './models/userTokens/dto/create-userTokens.dto';
export * from './models/userTokens/dto/update-userTokens.dto';
export * from './models/userTokens/dto/userTokens.response.dto';
export * from './models/userTokens/entities/userTokens.entity';

export * from './models/auth/dto/register.dto';
export * from './models/auth/dto/login.dto';


export * from './enums';
export * from './utils';
export * from './config';


// Add dummy JS export to force JS emission
export const __dummy = true;