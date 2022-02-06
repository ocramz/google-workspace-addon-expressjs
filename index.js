const express = require('express');
var morgan = require('morgan'); // logging middleware

const homeCard = require('./HomeCard');
const baseUrl = 'https://b250-83-252-130-101.ngrok.io';

const app = express();

app.use(morgan('combined'));
app.use(express.json());

app.get('/', (req, res) => {
    console.log('hello from /');
    res.json('hello!')
});

app.post('/', (req, res) => {
    // console.log( req.headers );
    // console.log( req.body );
    const bdy = req.body;
    if ( bdy.commonEventObject.formInputs ){
        const x = bdy.commonEventObject.formInputs;
        console.log( JSON.stringify( x ) );
    }

    // const event = req.body;
    // console.log('[/] event:', event);
    const c = homeCard( baseUrl );
    res.json({
        action: {
            navigations: [{ pushCard: c }],
        },
    });
});


// // // text input + validation
app.post('/ui/text_input/validation', (req, res) => {
    const card = {
        name : 'tiv_card',
        header : {},
        sections : [
            { widgets : [
                { textInput : {
                    name : 'tiv_1',
                    value : '1',
                    onChangeAction : {
                        function : baseUrl + '/ui/text_input/validation/check'
                    }
                } },

                { buttonList : {
                    buttons: [
                        { text : 'Go' ,
                          onClick : {
                              action : {
                                  function : baseUrl + '/ui/text_input/validation/ok' } } } ] } }

            ] }
        ]
    };
    const act = {
        action: { navigations : [ { pushCard : card } ] }
    };
    res.json( act );
});

// validation endpoint
app.post('/ui/text_input/validation/check', (req, res) => {
    const event = req.body.commonEventObject;
    console.log( JSON.stringify( event ));

    // extract form input value
    const i = event.formInputs.tiv_1.stringInputs.value;

    function wds( input ) {
        const wd0 = { textInput : {
            name : 'tiv_1',
            value : (i > 0) ? i : 1,
            onChangeAction : {
                function : baseUrl + '/ui/text_input/validation/check'
            }}};
        const wd1 = { decoratedText : {
            text : '<font color=\"#DB4437\">' + 'Must be > 1'+ '</font>'
        }};
        const wd2 = { buttonList : {
            buttons: [
                { text : 'Go' ,
                  onClick : {
                      action : {
                          function : baseUrl + '/ui/text_input/validation/ok' } } } ] } }

        const ret = (input > 0) ? [wd0, wd2] : [wd0, wd1, wd2];

        return ret;

    };

    const card = {
        name : 'card',
        header: {},
        sections: [
            { widgets : wds( i ) }
            ]
    };

    // NB : use RenderAction with stateChanged : true
    const act = {
        renderActions : {
            action : { navigations : [ { updateCard : card } ] }
        },
        stateChanged : true
    };

    res.json( act );
});

app.post('/ui/text_input/validation/ok', (req, res) => {
    const event = req.body.commonEventObject;
    console.log( JSON.stringify( event ));

    const card = {
        sections : [
            { widgets : [
                { textParagraph : { text : 'OK' }}
            ]}
        ]
    };
    // NB : use RenderAction with stateChanged : true
    
    const act = {
        renderActions : {
            action : { navigations : [ { pushCard : card } ] }
        },
        stateChanged : true
    };
    res.json( act );
});


// // // text input

app.post('/ui/text_input', (req, res) => {
    const card = {
        name : 'card',
        header: {},
        sections: [
            { widgets: [
                { textInput: {
                    name : 'text_in_1',
                    label : 'Text Input',
                    value : 'x',
                    autoCompleteAction : {
                        function : baseUrl + '/ui/text_input/ac' },
                    multipleSuggestions : true
                }},

                { selectionInput: {
                    name : 'form_test',
                    label : 'param_name',
                    type : 'RADIO_BUTTON',
                    items : [
                        { text : 'a', value : 1 },
                        { text : 'b', value : 2 },
                        { text : 'c', value : 3 }
                    ],
                }},


                { buttonList : {
                    buttons: [
                        { text : 'Go' ,
                          onClick : {
                              action : {
                                  function : baseUrl + '/ui/text_input/resp' } } } ] } }
                ]} ]};
    const act = {
        action: { navigations : [ { pushCard : card } ] }
    };
    res.json( act );
});

// autocomplete
app.post('/ui/text_input/ac', (req, res) => {
    const event = req.body.commonEventObject;
    console.log( JSON.stringify( event ));
    const c = {
        autoComplete : {
            items : [
                { text : 'a' },
                { text : 'b' }
            ]
        }
    };
    res.json( c );
});

app.post('/ui/text_input/resp', (req, res) => {
    const event = req.body.commonEventObject;
    const formData = event.formInputs;
    console.log( JSON.stringify( formData ) );
    const fdata1 = formData.text_in_1.stringInputs.value;
    const c = {
        name : 'card',
        header : {},
        sections : [
            {
                widgets : [
                    {
                        textParagraph : {
                            text : 'You wrote : ' + fdata1 } } ] } ] };
    const response = {
        renderActions : {
            action : {
                navigations : [
                    { pushCard : c } ] } } };
    res.json( response );
});


// // // RADIO buttons

app.post('/ui/radio', (req, res) => {
    const card = {
        name : 'card',
        header: {},
        sections: [
            { widgets: [
                { selectionInput: {
                    name : 'form_test',
                    label : 'param_name',
                    type : 'RADIO_BUTTON',
                    items : [
                        { text : 'a', value : 1 },
                        { text : 'b', value : 2 },
                        { text : 'c', value : 3 }
                    ],
                }},
                { buttonList : {
                    buttons: [
                        { text : 'Go' ,
                          onClick : {
                              action : {
                                  function : baseUrl + '/ui/radio/resp' } } } ] } } ]} ]};
    const act = {
        action: { navigations : [ { pushCard : card } ] }
    };
    res.json( act );
});

// form response
app.post('/ui/radio/resp', (req, res) => {
    const event = req.body.commonEventObject;
    const formData = event.formInputs;
    const fdata = formData.form_test.stringInputs.value;
    const c = {
        name : 'card',
        header : {},
        sections : [
            {
                widgets : [
                    {
                        textParagraph : {
                            text : 'You selected : ' + fdata } } ] } ] };
    const response = {
        renderActions : {
            action : {
                navigations : [
                    { pushCard : c } ] } } };
    res.json( response );
});


// // // request user authorization to read editor file

app.post('/requestFileScope', (req, res) => {
  res.json({
    renderActions: {
      hostAppAction: {
        'editor_action': {
          'request_file_scope_for_active_document': {},
        },
      },
    },
  });
});

app.post('/onFileScopeGranted', (req, res) => {
    const event = req.body;
    console.log('[/onFileScopeGranted] event:', event);
    const card = homeCard( baseUrl );
    res.json({
        action: {
            navigations: [{ pushCard: card }],
        },
    });
});

app.listen(8080, () => {
  console.log('Server running on port 8080');
});
