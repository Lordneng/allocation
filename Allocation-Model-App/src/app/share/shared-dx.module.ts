import { NgModule } from '@angular/core';
import { DxDataGridModule } from 'devextreme-angular/ui/data-grid';
import { DxTextBoxModule } from 'devextreme-angular/ui/text-box';
import { DxTextAreaModule } from 'devextreme-angular/ui/text-area';
import { DxDropDownBoxModule } from 'devextreme-angular/ui/drop-down-box';
import { DxSelectBoxModule } from 'devextreme-angular/ui/select-box';
import { DxFormModule } from 'devextreme-angular/ui/form';
import { DxValidatorModule } from 'devextreme-angular/ui/validator';
import { DxValidationSummaryModule } from 'devextreme-angular/ui/validation-summary';
import { DxValidationGroupModule } from 'devextreme-angular/ui/validation-group';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { DxTagBoxModule } from 'devextreme-angular/ui/tag-box';
import { DxDateBoxModule } from 'devextreme-angular/ui/date-box';
import { DxFileUploaderModule } from 'devextreme-angular/ui/file-uploader';
import { DxButtonModule } from 'devextreme-angular/ui/button';
import { DxPopupModule } from 'devextreme-angular/ui/popup';
import { DxScrollViewModule } from 'devextreme-angular/ui/scroll-view';
import { DxCheckBoxModule } from 'devextreme-angular/ui/check-box';
import { DxHtmlEditorModule } from 'devextreme-angular/ui/html-editor';
import { DxNumberBoxModule } from 'devextreme-angular/ui/number-box';
import { DxListModule } from 'devextreme-angular/ui/list';
import { DxAutocompleteModule } from 'devextreme-angular/ui/autocomplete';
import { DxTreeListModule } from 'devextreme-angular/ui/tree-list';
import { DxLookupModule } from 'devextreme-angular/ui/lookup';
import { DxTooltipModule } from 'devextreme-angular/ui/tooltip';
import { DxCalendarModule } from 'devextreme-angular/ui/calendar';
import { DxSchedulerModule } from 'devextreme-angular/ui/scheduler';
import { DxPieChartModule } from 'devextreme-angular/ui/pie-chart';
import { DxChartModule } from 'devextreme-angular/ui/chart';
import { DxDropDownButtonModule } from 'devextreme-angular/ui/drop-down-button';
import { DxPivotGridModule } from 'devextreme-angular/ui/pivot-grid';
import {DxColorBoxModule, DxContextMenuModule, DxSwitchModule} from 'devextreme-angular';
import { StickyDirective } from './directives/sticky.directive';

@NgModule({
  declarations: [
    StickyDirective,],
  imports: [
    DxDataGridModule,
    DxRadioGroupModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxDropDownBoxModule,
    DxSelectBoxModule,
    DxFormModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxPopupModule,
    DxScrollViewModule,
    DxListModule,
    DxAutocompleteModule,
    DxTreeListModule,
    DxLookupModule,
    DxTooltipModule,
    DxCalendarModule,
    DxSchedulerModule,
    DxPieChartModule,
    DxChartModule,
    DxDropDownButtonModule,
    DxPivotGridModule,
    DxColorBoxModule,
    DxSwitchModule,
    DxContextMenuModule
  ],
  exports: [
    StickyDirective,
    DxDataGridModule,
    DxRadioGroupModule,
    DxTextBoxModule,
    DxTextAreaModule,
    DxNumberBoxModule,
    DxDropDownBoxModule,
    DxSelectBoxModule,
    DxFormModule,
    DxValidatorModule,
    DxValidationGroupModule,
    DxValidationSummaryModule,
    DxTagBoxModule,
    DxDateBoxModule,
    DxFileUploaderModule,
    DxButtonModule,
    DxPopupModule,
    DxCheckBoxModule,
    DxScrollViewModule,
    DxHtmlEditorModule,
    DxNumberBoxModule,
    DxListModule,
    DxAutocompleteModule,
    DxTreeListModule,
    DxLookupModule,
    DxTooltipModule,
    DxCalendarModule,
    DxSchedulerModule,
    DxPieChartModule,
    DxChartModule,
    DxDropDownButtonModule,
    DxPivotGridModule,
    DxColorBoxModule,
    DxSwitchModule,
    DxContextMenuModule
  ]
})
export class SharedDxModule { }
