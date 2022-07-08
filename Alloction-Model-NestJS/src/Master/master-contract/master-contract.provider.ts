import { TOKENS } from '../../constants';
import { TypeORMProvider } from '../../common/providers';
import { Contract, ContractConditionOfSale, ContractCustomerPlant, ContractCustomerProductGrade, ContractRunningNumber, MasterContract } from './entity/';

export const masterContractsProvider = TypeORMProvider
    .create<MasterContract>(TOKENS.ProjectRepositoryToken, MasterContract);

export const contractsProvider = TypeORMProvider
    .create<Contract>(TOKENS.ProjectRepositoryTokenNew, Contract);

export const contractCustomerPlantsProvider = TypeORMProvider
    .create<ContractCustomerPlant>(TOKENS.ProjectRepositoryTokenForm, ContractCustomerPlant);

export const contractCustomerProductGradesProvider = TypeORMProvider
    .create<ContractCustomerProductGrade>(TOKENS.ProjectRepositoryTokenFormHistory, ContractCustomerProductGrade);

export const contractConditionOfSalesProvider = TypeORMProvider
    .create<ContractConditionOfSale>(TOKENS.ProjectRepositoryTokenHistory, ContractConditionOfSale);

export const contractRunningNumberProvider = TypeORMProvider
    .create<ContractRunningNumber>(TOKENS.ProjectRepositoryTokenImport, ContractRunningNumber);