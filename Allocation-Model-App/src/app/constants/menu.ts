import { environment } from 'src/environments/environment';
const adminRoot = environment.adminRoot;

export interface IMenuItem {
  id?: string;
  icon?: string;
  label: string;
  to: string;
  newWindow?: boolean;
  subs?: IMenuItem[];
}

// const data: IMenuItem[] = [
//   {
//     icon: 'iconsminds-files',
//     label: 'Plannign Report',
//     to: `/master2`,
//     subs: [
//       {
//         icon: 'simple-icon-doc',
//         label: 'Etane Ability',
//         to: `/master/master-tank-cap`,
//       }, {
//         icon: 'simple-icon-doc',
//         label: 'Inform OR',
//         to: `/master/master-contract`,
//       }, {
//         icon: 'simple-icon-doc',
//         label: 'LPG Rolling',
//         to: `/master/master-product-sell`,
//       }, {
//         icon: 'simple-icon-doc',
//         label: 'GSP Product Balance',
//         to: `/master/import-excel-config`,
//       }, {
//         icon: 'simple-icon-doc',
//         label: 'New Balance',
//         to: ``,
//       },
//     ],
//   }, {
//     icon: 'iconsminds-optimization',
//     label: 'Optimaize&Result',
//     to: `/cost-and-selling-price/optimaization`,
//     subs: [
//       {
//         icon: 'iconsminds-statistic',
//         label: 'Cal margin($/Ton)',
//         to: `/cost-and-selling-price/fullcost-and-sellingprice`,
//       }, {
//         icon: 'iconsminds-idea-2',
//         label: 'Result',
//         to: `/cost-and-selling-price/volume`,
//       }, {
//         icon: 'iconsminds-calculator',
//         label: 'Summary',
//         to: `/cost-and-selling-price/export`,
//       }
//     ]
//   }, {
//     icon: 'iconsminds-mail-money',
//     label: 'Reference Price',
//     to: `/ReferencePrice`,
//     subs: [
//       {
//         icon: 'iconsminds-coins',
//         label: 'Cost',
//         to: `/cost-and-selling-price/cost`,
//       }, {
//         icon: 'iconsminds-basket-coins',
//         label: 'Reference Price',
//         to: `/cost-and-selling-price/reference-price`,
//       }
//     ]
//   }, {
//     icon: 'iconsminds-factory',
//     label: 'Supply Plan',
//     to: `/cost-and-selling-price`,
//     // roles: [UserRole.Editor],
//     subs: [

//       {
//         icon: 'iconsminds-old-clock',
//         label: 'Ability Plan(RY)',
//         to: `/cost-and-selling-price/input-data/ability-plan-rayong`,
//       }, {
//         icon: 'iconsminds-old-clock',
//         label: 'Ability Pentane',
//         to: `/cost-and-selling-price/input-data/ability-pentane`,
//       }, {
//         icon: 'iconsminds-old-clock',
//         label: 'Ability Plan(KHM)',
//         to: `/cost-and-selling-price/input-data/ability-plan-khm`,
//       }, {
//         icon: 'iconsminds-old-clock',
//         label: 'Ability โรงกลั่น',
//         to: `/cost-and-selling-price/input-data/ability-refinery`,
//       }

//       ,
//     ],
//   }, {
//     icon: 'simple-icon-user',
//     label: 'Customer Constrain',
//     to: `/CustomerConstrain`,
//     subs: [
//       {
//         icon: 'simple-icon-paper-plane',
//         label: 'Customer',
//         to: `/customer-constrain/customer`,
//       }, {
//         icon: 'simple-icon-paper-plane',
//         label: 'Contract',
//         to: `/customer-constrain/contract`,
//       }, {
//         icon: 'simple-icon-paper-plane',
//         label: 'Contract-Old',
//         to: `/master/master-contract`,
//       }, {
//         icon: 'simple-icon-paper-plane',
//         label: 'Volume Constrain',
//         to: `/cost-and-selling-price/input-data/volume-constrain`,
//       },
//       // , {
//       //   icon: 'simple-icon-paper-plane',
//       //   label: 'Product Sell',
//       //   to: `/master/master-product-sell`,
//       // }
//       // , {
//       //   icon: 'simple-icon-paper-plane',
//       //   label: 'Import Excel Config',
//       //   to: `/master/import-excel-config`,
//       //   subs: [
//       //     {
//       //       icon: 'simple-icon-paper-plane',
//       //       label: 'Product Cost',
//       //       to: `/master/master-product-cost`,
//       //     }, {
//       //       icon: 'simple-icon-paper-plane',
//       //       label: 'Reference Price',
//       //       to: `/master/master-reference-price`,
//       //     },
//       //   ],
//       // },

//     ],
//   }, {
//     icon: 'iconsminds-space-needle',
//     label: 'Inventory & LR Constrain',
//     to: `/InventoryAndLRConstrain`,
//     subs: [
//       {
//         icon: 'iconsminds-chess',
//         label: 'Tank cap',
//         to: `/cost-and-selling-price/tank-cap`,
//       }, {
//         icon: 'iconsminds-rain-drop',
//         label: 'LR By Legal',
//         to: `/cost-and-selling-price/lr-by-legal`,
//       }, {
//         icon: 'iconsminds-link-2',
//         label: 'Depot Constrain',
//         to: `/cost-and-selling-price/depot-management`,
//       },
//     ],
//   },
//   {
//     icon: 'iconsminds-library',
//     label: 'System',
//     to: `/system`,
//     subs: [
//       // {
//       //   icon: 'simple-icon-paper-plane',
//       //   label: 'User Group',
//       //   to: `/system/user-group`,
//       // },
//       {
//         icon: 'simple-icon-paper-plane',
//         label: 'User',
//         to: `/system/user`,
//       },
//       {
//         icon: 'simple-icon-paper-plane',
//         label: 'Signature',
//         to: `/system/signature`,
//       }
//       // , {
//       //   icon: 'simple-icon-paper-plane',
//       //   label: 'Permission',
//       //   to: `/system/permission`,
//       // },
//     ],
//   }
// ];

const data: IMenuItem[] = [
  {
    icon: 'simple-icon-screen-desktop',
    label: 'Input Data',
    to: ``,
    subs: [
      {
        icon: 'iconsminds-factory',
        label: 'Supply Plan',
        to: `/cost-and-selling-price`,
        // roles: [UserRole.Editor],
        subs: [
          {
            icon: 'iconsminds-factory',
            label: 'Ability Rayong',
            to: `/cost-and-selling-price/input-data/ability-plan-rayong`,
          },
          {
            icon: 'iconsminds-factory',
            label: 'Ability Pentane',
            to: `/cost-and-selling-price/input-data/ability-pentane`,
          },
          {
            icon: 'iconsminds-factory',
            label: 'Ability Khm',
            to: `/cost-and-selling-price/input-data/ability-plan-khm`,
          },
          {
            icon: 'iconsminds-factory',
            label: 'Ability โรงกลั่น',
            to: `/cost-and-selling-price/input-data/ability-refinery`,
          },
        ],
      },
      {
        icon: 'iconsminds-mail-money',
        label: 'Reference Price',
        to: `/ReferencePrice`,
        subs: [
          {
            icon: 'simple-icon-diamond',
            label: 'Cost',
            to: `/cost-and-selling-price/cost`,
          },
          {
            icon: 'simple-icon-tag',
            label: 'Reference Price',
            to: `/cost-and-selling-price/reference-price`,
          },
        ],
      },
    ],
  },
  {
    icon: 'iconsminds-optimization',
    label: 'Optimaize&Result',
    to: `/cost-and-selling-price/optimaization`,
    subs: [
      {
        icon: 'iconsminds-statistic',
        label: 'Cal margin($/Ton)',
        to: `/cost-and-selling-price/fullcost-and-sellingprice`,
      },
      {
        icon: 'iconsminds-idea-2',
        label: 'Result',
        to: `/cost-and-selling-price/volume`,
      },
      {
        icon: 'iconsminds-calculator',
        label: 'Summary',
        to: `/cost-and-selling-price/export`,
      },
    ],
  },
  {
    icon: 'iconsminds-file',
    label: 'Planning Report',
    to: `/master2`,
    subs: [
      {
        icon: 'simple-icon-doc',
        label: 'Etane Ability',
        to: `/master/master-tank-cap`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'Inform OR',
        to: `/master/master-contract`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'LPG Rolling',
        to: `/master/master-product-sell`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'GSP Product Balance',
        to: `/master/import-excel-config`,
      },
      {
        icon: 'simple-icon-doc',
        label: 'New Balance',
        to: ``,
      },
    ],
  },
  {
    icon: 'iconsminds-space-needle',
    label: 'Inventory & LR Constrain',
    to: `/InventoryAndLRConstrain`,
    subs: [
      {
        icon: 'iconsminds-chess',
        label: 'Tank cap',
        to: `/cost-and-selling-price/tank-cap`,
      },
      {
        icon: 'iconsminds-rain-drop',
        label: 'LR By Legal',
        to: `/cost-and-selling-price/lr-by-legal`,
      },
      {
        icon: 'iconsminds-link-2',
        label: 'Depot Constrain',
        to: `/cost-and-selling-price/depot-management`,
      },
    ],
  },
  {
    icon: 'simple-icon-user',
    label: 'Customer Constrain',
    to: `/CustomerConstrain`,
    subs: [
      {
        icon: 'simple-icon-paper-plane',
        label: 'Customer',
        to: `/customer-constrain/customer`,
      },
      {
        icon: 'simple-icon-paper-plane',
        label: 'Contract',
        to: `/customer-constrain/contract`,
      },
      {
        icon: 'simple-icon-paper-plane',
        label: 'Contract-Old',
        to: `/master/master-contract`,
      },
      {
        icon: 'simple-icon-paper-plane',
        label: 'Volume Constrain',
        to: `/cost-and-selling-price/input-data/volume-constrain`,
      },
    ],
  },
  {
    icon: 'iconsminds-library',
    label: 'System',
    to: `/system`,
    subs: [
      {
        icon: 'simple-icon-paper-plane',
        label: 'User',
        to: `/system/user`,
      },
      {
        icon: 'simple-icon-paper-plane',
        label: 'Signature',
        to: `/system/signature`,
      },
    ],
  },
];

export default data;
