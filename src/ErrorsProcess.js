import PubSub from 'pubsub-js';

export default class ErrorsProcess {
    errorsPublish(err){
        err.errors.forEach(error => {
            PubSub.publish('validation-error', error)
        });
    }
}