# Usage 

Below is a configurable example of the basic usage of ember-foxy-forms, it showcases all of the html5 input controls
that can be mounted to your data model.

The various features can be toggled on / off below.

{{#docs-demo as |demo|}}
  {{#demo.example name="basic-usage.hbs"}}
      <Form
        @for={{this.anObject}} 
        @preventsNavigation={{this.preventsNavigation}}
        @readonly={{this.readonly}} 
        @disabled={{this.disabled}} 
        @inlineEditing={{this.inline}} 
        @hasControlCallout={{this.hasControlCallout}} 
        @autoSubmit={{this.autoSubmit}} 
        @scrollToFirstVisibleError={{this.scrollToFirstVisibleError}}
        @useBemClass={{this.useBemClass}}

        @successfulSubmitMessage={{this.successfulSubmitMessage}}
        @failedSubmitMessage={{this.failedSubmitMessage}}
        @didNotSubmitMessage={{this.didNotSubmitMessage}}
        @willSubmit={{this.willSubmit}}
        @onSubmit={{this.submit}}
        @didSubmit={{this.didSubmit}}
        @didNotSubmit={{this.didNotSubmit}}
       
        @successfulResetMessage={{this.successfulResetMessage}}
        @failedResetMessage={{this.failedResetMessage}}
        @didNotResetMessage={{this.didNotResetMessage}}
        @willReset={{this.willReset}}
        @didReset={{this.didReset}}
        @didNotReset={{this.didNotReset}}
        
        @successfulDestroyMessage={{this.successfulDestroyMessage}}
        @failedDestroyMessage={{this.failedDestroyMessage}}
        @didNotDestroyMessage={{this.didNotDestroyMessage}}
        @willDestroyModel={{this.willDestroy}}
        @didDestroyModel={{this.didDestroy}}
        @didNotDestroyModel={{this.didNotDestroy}}
        @failedDestroyModel={{this.failedDestroyModel}}
      as |form|>
        <h2 class="docs-md__h2">Form</h2>
        <div class="columns">
          <div>
            <form.field @for="string" @using="input" @label="String" @valueTooltip="An String" @editText='Click to edit' @infoText='A String'/>
            <form.field @for="password" @using="password" @label="Password" @valueTooltip="An Password" />
            <form.field @for="text" @using="textarea" @label="Text" @valueTooltip="An Text" as |ff|>
                <ff.control @maxLength='10' @showMaxLength={{true}} />
            </form.field>
            <form.field @for="email" @using="email" @label="Email" @valueTooltip="An Email"/>
            <form.field @for="url" @using="url" @label="Url" @valueTooltip="An Url"/>
            <form.field @for="tel" @using="tel" @label="Telephone" @valueTooltip="An Telephone"/>
            <form.field @for="search" @using="search" @label="Search" @valueTooltip="An Search"/>
            <form.field @for="number" @using="number" @label="Number" @valueTooltip="An Number"/>
            <form.field @for="number" @using="range" @label="Number" @valueTooltip="An Number"/>
            <form.field @for="currency" @using="currency" @label="Currency" @valueTooltip="An Currency"/>
          </div>
          <div>
            <form.field @for="color" @using="color" @label="Color" @valueTooltip="An Color"/>
            <form.field @for="date" @using="date" @label="Date" @valueTooltip="An Date"/>
            <form.field @for="time" @using="time" @label="Time" @valueTooltip="An Time"/>
            <form.field @for="datetime" @using="datetime" @label="Datetime" @valueTooltip="An Datetime"/>
            <form.field @for="boolean" @using="checkbox" @label="Boolean"  @valueTooltip="An Boolean"/>
            <form.field 
              @for="select" 
              @using="select" 
              @label="Select Primitive" 
              @values="1,2,3" 
              @valueTooltip="An Select"
            />
            <form.field 
              @for="selectObject" 
              @using="select" 
              @label="Select Object" 
              @values="1:one,2:two,3:three" 
              @valueTooltip="An Select"
            />
            <form.field 
              @for="checkboxSelect" 
              @using="checkbox-select" 
              @label="Checkbox Select Primitive" 
              @values="1,2,3" 
              @valueTooltip="An Checkbox Select"
            />
            <form.field 
              @for="checkboxSelectObject" 
              @using="checkbox-select" 
              @label="Checkbox Select Object" 
              @values="1:one,2:two,3:three" 
              @valueTooltip="An Checkbox Select"
            />
            <form.field 
              @for="radio" 
              @using="radio" 
              @label="Radio Primitive" 
              @values="1,2,3" 
              @valueTooltip="An Primitive Radio"
            />
            <form.field 
              @for="radioObject" 
              @using="radio" 
              @label="Radio Object" 
              @values="1:one,2:two,3:three" 
              @valueTooltip="An Object Radio"
            />
            <form.field 
              @for={{array "start" "end"}} 
              @using="multiple-input" 
              @label="Composite" 
              @valueTooltip="An Composite"
            />
          </div>
        </div>
         <form.submit/>
         <form.reset/>
         <form.destroy/>
         <form.button/>
         <h2>Logs</h2>
         <ul>
          {{#each this.logs as |log|}}
            <li>{{log}}</li>
          {{/each}}
         </ul>
      </Form>
      <h1>Features</h1>
      <Form @for={{this}} as |form|>
        <form.field 
          @for="errors" 
          @using="checkbox" 
          @didCommitValue={{this.toggleErrors}}
        as |f|>
          <f.control @label="Errors" />
        </form.field>
        <form.field 
          @for="scrollToFirstVisibleError" 
          @using="checkbox" 
        as |f|>
          <f.control @label="Scroll To Visible Error" />
        </form.field>
        <form.field @for="preventsNavigation" @using="checkbox" as |f|>
          <f.control @label="Prevents Navigation" />
        </form.field>
        <form.field @for="inline" @using="checkbox" as |f|>
          <f.control @label="Inline Editing" />
        </form.field>
        <form.field @for="hasControlCallout" @using="checkbox" as |f|>
          <f.control @label="Has Control Callout" />
        </form.field>
        <form.field @for="autoSubmit" @using="checkbox" as |f|>
          <f.control @label="Auto Submit" />
        </form.field>
        <form.field @for="disabled" @using="checkbox" as |f|>
          <f.control @label="Disabled" />
        </form.field>
        <form.field @for="readonly" @using="checkbox" as |f|>
          <f.control @label="Readonly" />
        </form.field>
        <form.field @for="useBemClass" @using="checkbox" as |f|>
          <f.control @label="Use bem class" />
        </form.field>
        <div class="columns">
          <div>
            <form.field @for="enableSubmit" @label='hi' @using="checkbox" class="push-right" as |f|>
              <f.control @label="willSubmit" />
            </form.field>
            <form.field 
              @for="successfulSubmitMessage"
              @label="Success"
              @using="input" 
             />
            <form.field 
              @for="didNotSubmitMessage"
              @label="Failed Preflight"
              @using="input" 
             />
            <form.field 
              @for="failedSubmitMessage"
              @label="Failed"
              @using="input" 
             />
          </div>
          <div>
            <form.field @for="enableReset" @using="checkbox" class="push-right" as |f|>
              <f.control @label="willReset" />
            </form.field>
            <form.field 
              @for="successfulResetMessage"
              @label="Success"
              @using="input" 
             />
            <form.field 
              @for="didNotResetMessage"
              @label="Failed Preflight"
              @using="input" 
             />
            <form.field 
              @for="failedResetMessage"
              @label="Failed"
              @using="input" 
             />
          </div>
          <div>
            <form.field @for="enableDestroy" @using="checkbox" class="push-right" as |f|>
              <f.control @label="willDestroy" />
            </form.field>
            <form.field 
              @for="successfulDestroyMessage"
              @label="Success"
              @using="input" 
             />
            <form.field 
              @for="didNotDestroyMessage"
              @label="Failed Preflight"
              @using="input" 
             />
            <form.field 
              @for="failedDestroyMessage"
              @label="Failed"
              @using="input" 
             />
          </div>
         </div>
      </Form>
      <div>
        <div>
          <h2 class="docs-md__h2">Model</h2>
          <pre class="hljs model"><code>{{json-pretty-print this.anObject}}</code></pre>
        </div>
      </div>
  {{/demo.example}}
  {{demo.snippet "basic-usage.hbs"}}
{{/docs-demo}}

