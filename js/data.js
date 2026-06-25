/* ============================================================
   Daily — static data: food library, exercises, goals, activity
   diet: 'veg' | 'egg' | 'nonveg'  ·  macros are cal / p / c / fat
   ============================================================ */
let FOODS=[
  /* ---- Breads / rotis ---- */
  {name:"Roti / Chapati (1)",cal:70,p:3,c:14,fat:1,diet:'veg'},
  {name:"Phulka (1)",cal:60,p:2,c:12,fat:1,diet:'veg'},
  {name:"Tandoori roti (1)",cal:110,p:3,c:22,fat:1,diet:'veg'},
  {name:"Butter naan (1)",cal:320,p:8,c:48,fat:11,diet:'veg'},
  {name:"Plain naan (1)",cal:260,p:7,c:46,fat:5,diet:'veg'},
  {name:"Garlic naan (1)",cal:300,p:8,c:48,fat:9,diet:'veg'},
  {name:"Aloo paratha (1)",cal:210,p:5,c:30,fat:8,diet:'veg'},
  {name:"Paneer paratha (1)",cal:280,p:10,c:30,fat:13,diet:'veg'},
  {name:"Plain paratha (1)",cal:180,p:4,c:26,fat:7,diet:'veg'},
  {name:"Lachha paratha (1)",cal:230,p:5,c:30,fat:10,diet:'veg'},
  {name:"Puri (2)",cal:170,p:3,c:22,fat:8,diet:'veg'},
  {name:"Bhatura (1)",cal:250,p:6,c:36,fat:9,diet:'veg'},
  {name:"Kulcha (1)",cal:200,p:6,c:36,fat:4,diet:'veg'},
  {name:"Bread slice (white, 1)",cal:70,p:2,c:13,fat:1,diet:'veg'},
  {name:"Brown bread slice (1)",cal:75,p:3,c:13,fat:1,diet:'veg'},
  {name:"Pav (1)",cal:120,p:3,c:22,fat:2,diet:'veg'},

  /* ---- Rice & one-pot ---- */
  {name:"Cooked rice (1 cup)",cal:200,p:4,c:44,fat:0,diet:'veg'},
  {name:"Jeera rice (1 cup)",cal:240,p:4,c:44,fat:6,diet:'veg'},
  {name:"Veg pulao (1 cup)",cal:250,p:5,c:42,fat:7,diet:'veg'},
  {name:"Veg biryani (1 plate)",cal:330,p:8,c:55,fat:9,diet:'veg'},
  {name:"Chicken biryani (1 plate)",cal:450,p:22,c:55,fat:16,diet:'nonveg'},
  {name:"Mutton biryani (1 plate)",cal:520,p:24,c:55,fat:22,diet:'nonveg'},
  {name:"Egg fried rice (1 plate)",cal:330,p:11,c:48,fat:10,diet:'egg'},
  {name:"Veg fried rice (1 plate)",cal:300,p:6,c:50,fat:8,diet:'veg'},
  {name:"Curd rice (1 cup)",cal:210,p:6,c:34,fat:5,diet:'veg'},
  {name:"Lemon rice (1 cup)",cal:230,p:4,c:40,fat:6,diet:'veg'},
  {name:"Khichdi (1 bowl)",cal:200,p:8,c:34,fat:4,diet:'veg'},
  {name:"Pongal (1 bowl)",cal:280,p:7,c:42,fat:9,diet:'veg'},

  /* ---- Dals & legumes ---- */
  {name:"Dal (toor/yellow, 1 cup)",cal:150,p:9,c:20,fat:4,diet:'veg'},
  {name:"Moong dal (1 cup)",cal:145,p:10,c:20,fat:3,diet:'veg'},
  {name:"Masoor dal (1 cup)",cal:150,p:11,c:22,fat:2,diet:'veg'},
  {name:"Dal makhani (1 cup)",cal:280,p:11,c:28,fat:14,diet:'veg'},
  {name:"Dal fry (1 cup)",cal:200,p:9,c:22,fat:8,diet:'veg'},
  {name:"Rajma (1 cup)",cal:215,p:15,c:37,fat:1,diet:'veg'},
  {name:"Chole / Chana masala (1 cup)",cal:270,p:15,c:45,fat:4,diet:'veg'},
  {name:"Lobia / black-eyed peas (1 cup)",cal:200,p:13,c:35,fat:1,diet:'veg'},
  {name:"Kadhi (1 cup)",cal:180,p:6,c:16,fat:10,diet:'veg'},
  {name:"Sambar (1 cup)",cal:140,p:7,c:20,fat:4,diet:'veg'},
  {name:"Rasam (1 cup)",cal:70,p:3,c:11,fat:2,diet:'veg'},
  {name:"Sprouts (1 cup)",cal:125,p:10,c:22,fat:1,diet:'veg'},

  /* ---- Sabzis (veg curries) ---- */
  {name:"Mixed veg sabzi (1 cup)",cal:150,p:4,c:18,fat:7,diet:'veg'},
  {name:"Aloo gobi (1 cup)",cal:160,p:4,c:20,fat:8,diet:'veg'},
  {name:"Bhindi masala (1 cup)",cal:150,p:3,c:15,fat:9,diet:'veg'},
  {name:"Baingan bharta (1 cup)",cal:140,p:3,c:14,fat:8,diet:'veg'},
  {name:"Aloo matar (1 cup)",cal:180,p:5,c:24,fat:7,diet:'veg'},
  {name:"Jeera aloo (1 cup)",cal:170,p:3,c:26,fat:7,diet:'veg'},
  {name:"Palak / saag (1 cup)",cal:120,p:5,c:10,fat:7,diet:'veg'},
  {name:"Mushroom masala (1 cup)",cal:160,p:6,c:12,fat:10,diet:'veg'},

  /* ---- Paneer ---- */
  {name:"Paneer, raw (100g)",cal:265,p:18,c:6,fat:20,diet:'veg'},
  {name:"Palak paneer (1 cup)",cal:280,p:14,c:12,fat:20,diet:'veg'},
  {name:"Matar paneer (1 cup)",cal:300,p:14,c:16,fat:20,diet:'veg'},
  {name:"Paneer butter masala (1 cup)",cal:350,p:15,c:14,fat:26,diet:'veg'},
  {name:"Kadai paneer (1 cup)",cal:320,p:15,c:13,fat:23,diet:'veg'},
  {name:"Shahi paneer (1 cup)",cal:360,p:14,c:15,fat:28,diet:'veg'},
  {name:"Paneer bhurji (1 cup)",cal:300,p:18,c:8,fat:22,diet:'veg'},
  {name:"Paneer tikka (6 pcs)",cal:280,p:20,c:8,fat:18,diet:'veg'},

  /* ---- South Indian ---- */
  {name:"Idli (2)",cal:120,p:4,c:24,fat:1,diet:'veg'},
  {name:"Plain dosa (1)",cal:170,p:4,c:30,fat:5,diet:'veg'},
  {name:"Masala dosa (1)",cal:290,p:6,c:44,fat:10,diet:'veg'},
  {name:"Rava dosa (1)",cal:240,p:5,c:36,fat:9,diet:'veg'},
  {name:"Uttapam (1)",cal:200,p:5,c:32,fat:6,diet:'veg'},
  {name:"Medu vada (2)",cal:230,p:6,c:26,fat:12,diet:'veg'},
  {name:"Upma (1 bowl)",cal:250,p:6,c:38,fat:9,diet:'veg'},
  {name:"Appam (2)",cal:200,p:4,c:38,fat:4,diet:'veg'},

  /* ---- Breakfast / quick ---- */
  {name:"Poha (1 plate)",cal:250,p:6,c:45,fat:6,diet:'veg'},
  {name:"Oats (cooked, 1 bowl)",cal:150,p:5,c:27,fat:3,diet:'veg'},
  {name:"Cornflakes + milk (1 bowl)",cal:220,p:8,c:38,fat:4,diet:'veg'},
  {name:"Besan chilla (2)",cal:220,p:12,c:22,fat:9,diet:'veg'},
  {name:"Sabudana khichdi (1 bowl)",cal:300,p:4,c:48,fat:11,diet:'veg'},
  {name:"Butter toast (2 slices)",cal:220,p:5,c:28,fat:10,diet:'veg'},
  {name:"Peanut butter (1 tbsp)",cal:95,p:4,c:3,fat:8,diet:'veg'},

  /* ---- Street food / snacks ---- */
  {name:"Samosa (1)",cal:160,p:3,c:18,fat:9,diet:'veg'},
  {name:"Kachori (1)",cal:180,p:4,c:20,fat:10,diet:'veg'},
  {name:"Veg pakora (6)",cal:200,p:5,c:18,fat:12,diet:'veg'},
  {name:"Vada pav (1)",cal:290,p:7,c:42,fat:11,diet:'veg'},
  {name:"Pav bhaji (1 plate)",cal:400,p:9,c:52,fat:18,diet:'veg'},
  {name:"Pani puri (6)",cal:180,p:4,c:34,fat:4,diet:'veg'},
  {name:"Bhel puri (1 plate)",cal:240,p:6,c:38,fat:8,diet:'veg'},
  {name:"Dhokla (3 pcs)",cal:160,p:6,c:26,fat:4,diet:'veg'},
  {name:"Aloo tikki (2)",cal:220,p:4,c:30,fat:10,diet:'veg'},
  {name:"Veg momos (6)",cal:220,p:6,c:38,fat:5,diet:'veg'},
  {name:"Chicken momos (6)",cal:260,p:14,c:34,fat:8,diet:'nonveg'},
  {name:"Spring roll (2)",cal:240,p:5,c:30,fat:11,diet:'veg'},

  /* ---- Eggs ---- */
  {name:"Egg, boiled (1)",cal:78,p:6,c:1,fat:5,diet:'egg'},
  {name:"Egg, fried (1)",cal:90,p:6,c:1,fat:7,diet:'egg'},
  {name:"Egg whites (3)",cal:51,p:11,c:1,fat:0,diet:'egg'},
  {name:"Omelette (2 egg)",cal:200,p:12,c:2,fat:15,diet:'egg'},
  {name:"Egg bhurji (2 egg)",cal:220,p:13,c:5,fat:16,diet:'egg'},
  {name:"Egg curry (2 egg)",cal:280,p:14,c:10,fat:20,diet:'egg'},

  /* ---- Chicken ---- */
  {name:"Chicken breast (100g)",cal:165,p:31,c:0,fat:4,diet:'nonveg'},
  {name:"Chicken curry (1 cup)",cal:240,p:20,c:8,fat:14,diet:'nonveg'},
  {name:"Butter chicken (1 cup)",cal:380,p:24,c:12,fat:26,diet:'nonveg'},
  {name:"Chicken tikka (6 pcs)",cal:250,p:30,c:6,fat:11,diet:'nonveg'},
  {name:"Tandoori chicken (2 pcs)",cal:300,p:35,c:4,fat:16,diet:'nonveg'},
  {name:"Chicken 65 (1 plate)",cal:340,p:26,c:14,fat:20,diet:'nonveg'},
  {name:"Grilled chicken (150g)",cal:250,p:46,c:0,fat:6,diet:'nonveg'},
  {name:"Chicken keema (1 cup)",cal:300,p:22,c:6,fat:21,diet:'nonveg'},

  /* ---- Fish / seafood ---- */
  {name:"Fish, cooked (100g)",cal:180,p:22,c:0,fat:10,diet:'nonveg'},
  {name:"Fish curry (1 cup)",cal:240,p:22,c:8,fat:13,diet:'nonveg'},
  {name:"Fried fish (2 pcs)",cal:280,p:24,c:10,fat:16,diet:'nonveg'},
  {name:"Prawns / shrimp (100g)",cal:100,p:20,c:1,fat:2,diet:'nonveg'},
  {name:"Tuna, canned (100g)",cal:130,p:28,c:0,fat:1,diet:'nonveg'},

  /* ---- Mutton ---- */
  {name:"Mutton, cooked (100g)",cal:250,p:25,c:0,fat:17,diet:'nonveg'},
  {name:"Mutton curry (1 cup)",cal:350,p:24,c:8,fat:25,diet:'nonveg'},
  {name:"Rogan josh (1 cup)",cal:380,p:25,c:10,fat:27,diet:'nonveg'},

  /* ---- Dairy & protein ---- */
  {name:"Curd / Dahi (1 cup)",cal:100,p:8,c:12,fat:3,diet:'veg'},
  {name:"Greek yogurt (1 cup)",cal:130,p:18,c:8,fat:3,diet:'veg'},
  {name:"Milk, full (1 cup)",cal:120,p:8,c:12,fat:5,diet:'veg'},
  {name:"Milk, toned (1 cup)",cal:90,p:8,c:12,fat:2,diet:'veg'},
  {name:"Buttermilk (1 glass)",cal:40,p:3,c:5,fat:1,diet:'veg'},
  {name:"Sweet lassi (1 glass)",cal:220,p:8,c:34,fat:6,diet:'veg'},
  {name:"Whey protein (1 scoop)",cal:120,p:24,c:3,fat:2,diet:'veg'},
  {name:"Mass gainer (1 scoop)",cal:380,p:20,c:65,fat:5,diet:'veg'},
  {name:"Soya chunks (50g dry)",cal:175,p:26,c:13,fat:1,diet:'veg'},
  {name:"Tofu (100g)",cal:145,p:16,c:3,fat:8,diet:'veg'},
  {name:"Cheese slice (1)",cal:70,p:4,c:1,fat:6,diet:'veg'},

  /* ---- Fruits ---- */
  {name:"Banana (1)",cal:105,p:1,c:27,fat:0,diet:'veg'},
  {name:"Apple (1)",cal:95,p:0,c:25,fat:0,diet:'veg'},
  {name:"Orange (1)",cal:62,p:1,c:15,fat:0,diet:'veg'},
  {name:"Mango (1)",cal:150,p:1,c:38,fat:1,diet:'veg'},
  {name:"Papaya (1 cup)",cal:60,p:1,c:15,fat:0,diet:'veg'},
  {name:"Watermelon (1 cup)",cal:46,p:1,c:12,fat:0,diet:'veg'},
  {name:"Grapes (1 cup)",cal:100,p:1,c:27,fat:0,diet:'veg'},
  {name:"Pomegranate (1 cup)",cal:145,p:3,c:33,fat:2,diet:'veg'},
  {name:"Guava (1)",cal:70,p:3,c:15,fat:1,diet:'veg'},
  {name:"Dates (3)",cal:60,p:0,c:16,fat:0,diet:'veg'},

  /* ---- Nuts & seeds ---- */
  {name:"Almonds (15)",cal:105,p:4,c:4,fat:9,diet:'veg'},
  {name:"Peanuts (30g)",cal:170,p:8,c:5,fat:14,diet:'veg'},
  {name:"Walnuts (4 halves)",cal:100,p:2,c:2,fat:10,diet:'veg'},
  {name:"Cashews (15)",cal:155,p:5,c:9,fat:12,diet:'veg'},
  {name:"Chia seeds (1 tbsp)",cal:60,p:2,c:5,fat:4,diet:'veg'},
  {name:"Makhana (1 cup)",cal:90,p:3,c:18,fat:1,diet:'veg'},

  /* ---- Western / fast food ---- */
  {name:"Veg sandwich (1)",cal:250,p:8,c:36,fat:8,diet:'veg'},
  {name:"Grilled cheese sandwich (1)",cal:350,p:12,c:34,fat:18,diet:'veg'},
  {name:"Pizza slice (1)",cal:285,p:12,c:36,fat:10,diet:'veg'},
  {name:"Veg burger (1)",cal:350,p:10,c:46,fat:14,diet:'veg'},
  {name:"Chicken burger (1)",cal:420,p:22,c:42,fat:19,diet:'nonveg'},
  {name:"Pasta, white sauce (1 plate)",cal:420,p:13,c:54,fat:16,diet:'veg'},
  {name:"Maggi noodles (1 pack)",cal:300,p:7,c:42,fat:11,diet:'veg'},
  {name:"French fries (medium)",cal:340,p:4,c:44,fat:17,diet:'veg'},
  {name:"Fried chicken (2 pcs)",cal:480,p:30,c:18,fat:32,diet:'nonveg'},

  /* ---- Sweets & desserts ---- */
  {name:"Gulab jamun (2)",cal:300,p:4,c:44,fat:12,diet:'veg'},
  {name:"Jalebi (2)",cal:300,p:2,c:50,fat:11,diet:'veg'},
  {name:"Rasgulla (2)",cal:200,p:4,c:38,fat:4,diet:'veg'},
  {name:"Kheer (1 bowl)",cal:250,p:6,c:40,fat:8,diet:'veg'},
  {name:"Gajar halwa (1 bowl)",cal:330,p:5,c:42,fat:16,diet:'veg'},
  {name:"Besan ladoo (1)",cal:180,p:3,c:22,fat:9,diet:'veg'},
  {name:"Ice cream (1 scoop)",cal:140,p:2,c:17,fat:7,diet:'veg'},
  {name:"Dark chocolate (30g)",cal:170,p:2,c:13,fat:12,diet:'veg'},

  /* ---- Drinks ---- */
  {name:"Masala chai (1 cup)",cal:90,p:2,c:12,fat:3,diet:'veg'},
  {name:"Coffee with milk (1 cup)",cal:80,p:3,c:9,fat:3,diet:'veg'},
  {name:"Black coffee (1 cup)",cal:5,p:0,c:1,fat:0,diet:'veg'},
  {name:"Green tea (1 cup)",cal:2,p:0,c:0,fat:0,diet:'veg'},
  {name:"Cola (1 can)",cal:140,p:0,c:39,fat:0,diet:'veg'},
  {name:"Orange juice (1 glass)",cal:110,p:2,c:26,fat:0,diet:'veg'},
  {name:"Coconut water (1 glass)",cal:45,p:2,c:9,fat:0,diet:'veg'},
];

const EXERCISES=[
  {name:"Running",rate:11},{name:"Jogging",rate:9},{name:"Walking",rate:5},
  {name:"Cycling",rate:8},{name:"Weight training",rate:6},{name:"Calisthenics",rate:7},
  {name:"HIIT",rate:13},{name:"Yoga",rate:4},{name:"Pilates",rate:5},
  {name:"Swimming",rate:10},{name:"Skipping / Jump rope",rate:12},{name:"Boxing",rate:12},
  {name:"Dancing / Zumba",rate:8},{name:"Stair climbing",rate:9},{name:"Elliptical",rate:9},
  {name:"Rowing",rate:10},{name:"Badminton",rate:7},{name:"Tennis",rate:8},
  {name:"Basketball",rate:8},{name:"Cricket / Football",rate:8},{name:"Hiking",rate:7},
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
