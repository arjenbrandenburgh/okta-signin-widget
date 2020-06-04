import { Form, loc, createCallout, _ } from 'okta';
import FormInputFactory from './FormInputFactory';

export default Form.extend({

  layout: 'o-form-theme',
  className: 'ion-form',
  hasSavingState: true,
  autoSave: false,
  noCancelButton: true,
  title () {
    return loc('oform.title.authenticate', 'login');
  },
  save: loc('oform.next', 'login'),

  initialize () {
    const uiSchemas = this.getUISchema();
    const inputOptions = uiSchemas.map(FormInputFactory.create);

    //should be used before adding any other input components
    this.addCallouts();

    inputOptions.forEach(input => {
      this.addInputOrView(input);
    });

    this.listenTo(this, 'save', this.saveForm);
    _.each(this.model.attributes, (value, key) => {
      if (key.match(/__[^ ]+__/)) {
        this.listenTo(this.model, `change:${key}`, (model, newValue) => {
          this.options.appState.trigger('switchSubSchema', {[key]: newValue});
        });
      }
    });
  },

  saveForm (model) {
    //remove any existing warnings or messages before saving form
    this.$el.find('.o-form-error-container').empty();
    this.options.appState.trigger('saveForm', model);
  },

  getUISchema () {
    if (Array.isArray(this.options.currentViewState.uiSchema)) {
      return this.options.currentViewState.uiSchema;
    } else {
      return [];
    }
  },

  addInputOrView (input) {
    if (input.visible === false || input.mutable === false) {
      return;
    }
    if (input.View) {
      this.add(input.View, {
        options: input.options
      });
    } else {
      this.addInput(input);
    }

    if (Array.isArray(input.optionsUiSchemas)) {
      const subSchemaIndex = Number(this.options.subSchemaConfig[input.name]) || 0;
      input.optionsUiSchemas[subSchemaIndex].forEach(this.addInputOrView.bind(this));
    }
  },

  addCallouts () {
    const warningMsgs = this.options.appState.get('messages');
    if (warningMsgs && warningMsgs.value.length) {
      const messageCallout = createCallout({
        content: warningMsgs.value[0].message,
        type: 'warning',
      });
      this.add(messageCallout, '.o-form-error-container');
    }
  },
});
