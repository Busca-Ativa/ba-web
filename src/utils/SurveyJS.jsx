
const surveyElements = {
  elements: [
    {
      type: 'radiogroup',
      name: 'question1',
      title: 'First question',
      choices: ['Option 1', 'Option 2', 'Option 3'],
    },
    {
      "type": "comment",
      "name": "suggestions-auto-grow",
      "title": "What would make you more satisfied with our product?",
      "description": "The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.",
      "rows": 2,
      "autoGrow": true,
      "allowResize": false
    },
    {
      "type": "text",
      "name": "Text test",
      "title": "Teste de texto",
      "description": "The comment area has an initial height of two rows and automatically expands or shrinks to accomodate the content.",
    },
    {
      type: 'dropdown',
      name: 'question2',
      title: 'Second question',
      choices: ['Option A', 'Option B', 'Option C'],
      showNoneItem: true,
      showOtherItem: true,
      choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ]
    },
    {
      type: "tagbox",
      isRequired: true,
      choicesByUrl: {
        url: "https://surveyjs.io/api/CountriesExample"
      },
      name: "countries",
      title: "Which countries have you visited within the last three years?",
      description: "Please select all that apply."
    },
    {
      type: "checkbox",
      name: "car",
      title: "Which is the brand of your car?",
      description: "If you own cars from multiple brands, please select all of them.",
      choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ],
      isRequired: true,
      colCount: 2,
      showNoneItem: true,
      showOtherItem: true,
      showSelectAllItem: true,
      separateSpecialChoices: true
    },
    {
      type: "boolean",
      name: "slider",
      title: "Are you 21 or older?",
      description: "Display mode = Default (Slider)",
      valueTrue: "Yes",
      valueFalse: "No"
    },
    {
    type: "boolean",
    name: "radiobutton",
    title: "Are you 21 or older?",
    description: "Display mode = Radio",
    valueTrue: "Yes",
    valueFalse: "No",
    renderAs: "radio"
    },
    {
    type: "boolean",
    name: "checkbox",
    label: "I am 21 or older",
    titleLocation: "hidden",
    valueTrue: "Yes",
    valueFalse: "No",
    renderAs: "checkbox"
    }
  ],
}

const surveyPageExample = {
  pages: [
    {
      elements: [
        {
          type: "boolean",
          name: "checkbox",
          label: "I am 21 or older",
          titleLocation: "hidden",
          valueTrue: "Yes",
          valueFalse: "No",
          renderAs: "checkbox"
        },
      ]
    },
    {
      elements: [
        {
          type: "checkbox",
          name: "car",
          title: "Which is the brand of your car?",
          description: "If you own cars from multiple brands, please select all of them.",
          choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ],
          isRequired: true,
          colCount: 2,
          showNoneItem: true,
          showOtherItem: true,
          showSelectAllItem: true,
          separateSpecialChoices: true
        },
      ]
    },
    {
      elements: [
        {
          type: 'dropdown',
          name: 'question2',
          title: 'Second question',
          choices: ['Option A', 'Option B', 'Option C'],
          showNoneItem: true,
          showOtherItem: true,
          choices: [ "Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota", "Citroen" ]
        },
      ]
    },
  ]
}

export {surveyElements , surveyPageExample}
