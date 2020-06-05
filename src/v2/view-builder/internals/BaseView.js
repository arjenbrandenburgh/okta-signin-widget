import { View } from 'okta';
import BaseForm from './BaseForm';
import BaseModel from './BaseModel';
import BaseHeader from './BaseHeader';
import BaseFooter from './BaseFooter';

export default View.extend({

  Header: BaseHeader,

  Body: BaseForm,

  Footer: BaseFooter,

  className: 'siw-main-view',

  template: '<div class="siw-main-header"></div>' +
      '<div class="siw-main-body"></div>' +
      '<div class="siw-main-footer"></div>',

  initialize () {
    // Create Model
    const IonModel = this.createModelClass();
    const model = new IonModel ({
      formName: this.options.currentViewState.name,
    });

    // Add Views
    this.add(this.Header, { selector: '.siw-main-header' });
    this.add(this.Body, {
      selector : '.siw-main-body',
      options: {
        model,
        subSchemaConfig: this.options.subSchemaConfig
      },
    });
    this.add(this.Footer, { selector : '.siw-main-footer' });
  },

  postRender () {
    // If user enterted identifier is not found, API sends back a message with a link to sign up
    // This is the click handler for that link
    const appState = this.options.appState;
    this.$el.find('.js-sign-up').click(function () {
      appState.trigger('invokeAction', 'select-enroll-profile');
      return false;
    });
  },

  createModelClass () {
    return BaseModel.create(this.options.currentViewState, this.options.subSchemaConfig);
  }

});
