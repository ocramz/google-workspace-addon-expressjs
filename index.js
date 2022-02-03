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

// // // text input

app.post('/ui/text_input', (req, res) => {
    const card = {
        name : 'card',
        header: {},
        sections: [
            { widgets: [
                { textInput: {
                    name : 'text_in',
                    label : 'Text Input',
                    value : 'write something here'
                }} ,
                { buttonList : {
                    buttons: [
                        { text : 'Go' ,
                          onClick : {
                              action : {
                                  function : baseUrl + '/ui/text_input/resp' } } } ] } } ]} ]};
    const act = {
        action: { navigations : [ { pushCard : card } ] }
    };
    res.json( act );
});

app.post('/ui/text_input/resp', (req, res) => {
    const event = req.body.commonEventObject;
    const formData = event.formInputs;
    console.log( JSON.stringify( formData ) );
    const fdata = formData.text_in.stringInputs.value;
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


// // // RADIO buttons

app.post('/ui/radio', (req, res) => {
    const card = {
        name : 'card',
        header: {},
        sections: [
            {widgets: [
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
