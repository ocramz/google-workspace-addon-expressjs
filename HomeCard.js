function homeCard( baseUrl ) {
    const card = {
        name: 'Home',
          sections: [
              {
                  widgets: [
                      {
                          textParagraph: {
                              text: 'Click the button below to give the Add-on access to this file.',
                          },
                      },
                  ],
              },
          ],
          fixedFooter: {
              primaryButton: {
                  text: 'Allow access',
                  onClick: {
                      action: {
                          function: baseUrl + '/requestFileScope',
                      },
                  },
              }
          }
    };
    return card;
}

module.exports = homeCard;

// const HomeCard = {
//   name: 'Home',
//   sections: [
//     {
//       widgets: [
//         {
//           textParagraph: {
//             text: 'Click the button below to give the Add-on access to this file.',
//           },
//         },
//       ],
//     },
//   ],
//   fixedFooter: {
//     primaryButton: {
//       text: 'Allow access',
//       onClick: {
//         action: {
//           function: BASE_URL + '/requestFileScope',
//         },
//       },
//     }
//   }
// };


