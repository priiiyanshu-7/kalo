/* ============================================================
   Daily — static data: food library, exercises, goals, activity
   diet: 'veg' | 'egg' | 'nonveg'  ·  macros are cal / p / c / fat
   ============================================================ */
let FOODS=[
  {name:"Roti (1)",cal:70,p:3,c:14,fat:1,diet:'veg'},
  {name:"Cooked rice (1 cup)",cal:200,p:4,c:44,fat:0,diet:'veg'},
  {name:"Dal (1 cup)",cal:150,p:9,c:20,fat:4,diet:'veg'},
  {name:"Paneer (100g)",cal:265,p:18,c:6,fat:20,diet:'veg'},
  {name:"Rajma (1 cup)",cal:215,p:15,c:37,fat:1,diet:'veg'},
  {name:"Chole (1 cup)",cal:270,p:15,c:45,fat:4,diet:'veg'},
  {name:"Curd / Dahi (1 cup)",cal:100,p:8,c:12,fat:3,diet:'veg'},
  {name:"Idli (2)",cal:120,p:4,c:24,fat:1,diet:'veg'},
  {name:"Dosa (1)",cal:170,p:4,c:30,fat:5,diet:'veg'},
  {name:"Poha (1 plate)",cal:250,p:6,c:45,fat:6,diet:'veg'},
  {name:"Soya chunks (50g)",cal:175,p:26,c:13,fat:1,diet:'veg'},
  {name:"Tofu (100g)",cal:145,p:16,c:3,fat:8,diet:'veg'},
  {name:"Sprouts (1 cup)",cal:125,p:10,c:22,fat:1,diet:'veg'},
  {name:"Milk (1 cup)",cal:120,p:8,c:12,fat:5,diet:'veg'},
  {name:"Peanuts (30g)",cal:170,p:8,c:5,fat:14,diet:'veg'},
  {name:"Banana (1)",cal:105,p:1,c:27,fat:0,diet:'veg'},
  {name:"Aloo paratha (1)",cal:210,p:5,c:30,fat:8,diet:'veg'},
  {name:"Oats (1 bowl, 40g)",cal:150,p:5,c:27,fat:3,diet:'veg'},
  {name:"Whey scoop (1)",cal:120,p:24,c:3,fat:2,diet:'veg'},
  {name:"Almonds (15)",cal:105,p:4,c:4,fat:9,diet:'veg'},
  {name:"Egg, boiled (1)",cal:78,p:6,c:1,fat:5,diet:'egg'},
  {name:"Egg whites (3)",cal:51,p:11,c:1,fat:0,diet:'egg'},
  {name:"Omelette (2 egg)",cal:200,p:12,c:2,fat:15,diet:'egg'},
  {name:"Egg bhurji (2 egg)",cal:220,p:13,c:5,fat:16,diet:'egg'},
  {name:"Chicken breast (100g)",cal:165,p:31,c:0,fat:4,diet:'nonveg'},
  {name:"Fish (100g)",cal:180,p:22,c:0,fat:10,diet:'nonveg'},
  {name:"Chicken curry (1 cup)",cal:240,p:20,c:8,fat:14,diet:'nonveg'},
  {name:"Mutton (100g)",cal:250,p:25,c:0,fat:17,diet:'nonveg'},
];

const EXERCISES=[
  {name:"Running",rate:11},{name:"Cycling",rate:8},{name:"Weight training",rate:6},
  {name:"Walking",rate:5},{name:"Yoga",rate:4},{name:"HIIT",rate:13},
  {name:"Swimming",rate:10},{name:"Cricket / Football",rate:8},{name:"Skipping",rate:12},
];

const GOALS={
  lose:{t:'Lose fat',d:'Trim body fat, keep your strength'},
  maintain:{t:'Maintain',d:'Hold your weight, eat consistently'},
  gain:{t:'Build muscle',d:'Lean bulk with a calorie surplus'},
  recomp:{t:'Body recomposition',d:'Lose fat & build muscle at once'},
};
const ACTIVITY={
  sedentary:'Mostly sitting',
  light:'Light — 1–3 workouts/week',
  moderate:'Moderate — 3–5/week',
  active:'Very active — 6–7/week',
  athlete:'Athlete — 2x/day',
};
