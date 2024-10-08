let isSpeechEnabled = true;
let speechSynthesis = window.speechSynthesis;

document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-btn');
    if (startButton) {
        startButton.addEventListener('click', () => showScreen('user-type-screen'));
    }

    // User type selection
    const leftSide = document.querySelector('.left-side');
    const rightSide = document.querySelector('.right-side');
    if (leftSide && rightSide) {
        leftSide.addEventListener('click', () => showScreen('normal-user-form'));
        rightSide.addEventListener('click', () => showScreen('disabled-user-form'));
    }

    // Normal user form submission
    const normalForm = document.getElementById('normal-form');
    if (normalForm) {
        normalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const height = document.getElementById('height').value / 100; // convert cm to m
            const weight = document.getElementById('weight').value;
            const bmi = calculateBMI(weight, height);
            showBMIResult(bmi);
        });
    }

    // Disabled user form submission
    const disabledForm = document.getElementById('disabled-form');
    if (disabledForm) {
        disabledForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const disabilityType = document.getElementById('disability-type').value;
            showRecommendations(disabilityType);
        });
    }

    // View recommendations button for normal users
    const btnExercises = document.getElementById('btn-exercises');
    if (btnExercises) {
        btnExercises.addEventListener('click', () => {
            const bmiCategory = document.getElementById('bmi-category').textContent;
            showRecommendations(bmiCategory);
        });
    }

    // Toggle diet plan visibility
    const toggleDietBtn = document.getElementById('toggle-diet');
    if (toggleDietBtn) {
        toggleDietBtn.addEventListener('click', toggleDietPlan);
    }

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);

    // Contact form submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your message. We will get back to you soon!');
            speak('Thank you for your message. We will get back to you soon!');
        });
    }

    // Text-to-speech toggle
    const speechToggle = document.getElementById('speech-toggle');
    if (speechToggle) {
        speechToggle.addEventListener('click', toggleSpeech);
    }

    // Initial speech
    speak(document.querySelector('h1').textContent);
});

function speak(text) {
    if (isSpeechEnabled && speechSynthesis) {
        speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    }
}

function toggleSpeech() {
    isSpeechEnabled = !isSpeechEnabled;
    const speechToggle = document.getElementById('speech-toggle');
    if (speechToggle) {
        speechToggle.textContent = isSpeechEnabled ? 'Disable Speech' : 'Enable Speech';
    }
    if (isSpeechEnabled) {
        speak("Speech enabled");
    } else {
        speechSynthesis.cancel();
    }
}

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.classList.add('hidden'));
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.remove('hidden');
        announceScreenChange(screenId);
        speak(targetScreen.querySelector('h1, h2').textContent);
    }
}

function calculateBMI(weight, height) {
    return (weight / (height * height)).toFixed(1);
}

function showBMIResult(bmi) {
    const bmiValue = document.getElementById('bmi-value');
    const bmiCategory = document.getElementById('bmi-category');
    if (bmiValue && bmiCategory) {
        bmiValue.textContent = `Your BMI is ${bmi}`;
        let category;
        if (bmi < 18.5) category = "Underweight";
        else if (bmi < 25) category = "Normal weight";
        else if (bmi < 30) category = "Overweight";
        else category = "Obese";
        bmiCategory.textContent = category;
        showScreen('bmi-result');
        speak(`Your BMI is ${bmi}. Your category is ${category}.`);
    }
}

function showRecommendations(category) {
    const exerciseList = document.getElementById('exercise-list');
    const dietPlan = document.getElementById('diet-plan');
    if (exerciseList && dietPlan) {
        exerciseList.innerHTML = '';
        dietPlan.innerHTML = '';
        let exercises, diet;

        switch(category) {
            case 'Underweight':
                exercises = [
                    { name: 'Squats', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Push-ups', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Lunges', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Dumbbell rows', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Oatmeal with nuts and fruits',
                    'Snack: Greek yogurt with honey',
                    'Lunch: Chicken breast with brown rice and vegetables',
                    'Snack: Protein shake with banana',
                    'Dinner: Salmon with sweet potato and broccoli'
                ];
                break;
            case 'Normal weight':
                exercises = [
                    { name: 'Jogging', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Cycling', duration: '45 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Swimming', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Strength training', sets: 3, reps: 12, image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Whole grain toast with avocado and eggs',
                    'Snack: Apple with almond butter',
                    'Lunch: Grilled chicken salad with mixed greens',
                    'Snack: Carrot sticks with hummus',
                    'Dinner: Lean beef stir-fry with vegetables and quinoa'
                ];
                break;
            case 'Overweight':
            case 'Obese':
                exercises = [
                    { name: 'Brisk walking', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Water aerobics', duration: '45 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Stationary cycling', duration: '20 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Yoga', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Greek yogurt with berries and chia seeds',
                    'Snack: Celery sticks with peanut butter',
                    'Lunch: Turkey and vegetable soup with whole grain crackers',
                    'Snack: Orange slices',
                    'Dinner: Grilled fish with roasted vegetables'
                ];
                break;
            case 'mobility':
                exercises = [
                    { name: 'Seated arm circles', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Chair yoga', duration: '20 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Resistance band exercises', sets: 3, reps: 12, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Seated leg lifts', sets: 3, reps: 15, image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Smoothie with spinach, banana, and protein powder',
                    'Snack: Mixed nuts',
                    'Lunch: Tuna salad with whole grain bread',
                    'Snack: Sliced bell peppers with guacamole',
                    'Dinner: Baked chicken with sweet potato and green beans'
                ];
                break;
            case 'visual':
                exercises = [
                    { name: 'Guided walking', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Tandem cycling', duration: '45 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Swimming with a guide', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Bodyweight exercises', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Scrambled eggs with spinach and whole grain toast',
                    'Snack: Banana with almond butter',
                    'Lunch: Lentil soup with mixed vegetables',
                    'Snack: Greek yogurt with honey',
                    'Dinner: Grilled chicken with quinoa and roasted vegetables'
                ];
                break;
            case 'hearing':
                exercises = [
                    { name: 'Running', duration: '20 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Weight lifting', sets: 3, reps: 10, image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Yoga', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Pilates', duration: '45 minutes', image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Oatmeal with berries and flaxseeds',
                    'Snack: Hard-boiled egg',
                    'Lunch: Grilled vegetable and chicken wrap',
                    'Snack: Apple slices with peanut butter',
                    'Dinner: Baked salmon with brown rice and broccoli'
                ];
                break;
            case 'cognitive':
                exercises = [
                    { name: 'Simple aerobics', duration: '20 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Guided stretching', duration: '15 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Balance exercises', sets: 3, duration: '5 minutes', image: '/placeholder.svg?height=150&width=150' },
                    { name: 'Memory-enhancing physical games', duration: '30 minutes', image: '/placeholder.svg?height=150&width=150' }
                ];
                diet = [
                    'Breakfast: Whole grain cereal with milk and sliced banana',
                    'Snack: Carrot sticks with hummus',
                    'Lunch: Turkey and avocado sandwich on whole grain bread',
                    'Snack: Blueberries and almonds',
                    'Dinner: Grilled fish with sweet potato and green salad'
                ];
                break;
            default:
                exercises = [{ name: 'Please consult with a healthcare professional for personalized exercise recommendations.' }];
                diet = ['Please consult with a nutritionist for a personalized diet plan.'];
        }

        exercises.forEach(exercise => {
            const card = document.createElement('div');
            card.className = 'exercise-card';
            card.innerHTML = `
                <img src="${exercise.image}" alt="${exercise.name}" class="exercise-image">
                <h3>${exercise.name}</h3>
                <p>${exercise.duration || `${exercise.sets} sets of ${exercise.reps} reps`}</p>
            `;
            exerciseList.appendChild(card);
        });

        diet.forEach(meal => {
            const li = document.createElement('li');
            li.textContent = meal;
            dietPlan.appendChild(li);
        });

        showScreen('recommendations');
        speak("Here are your personalized recommendations. You can find exercise recommendations and a diet plan on this page.");
    }
}

function toggleDietPlan() {
    const dietPlan = document.getElementById('diet-plan');
    const toggleBtn = document.getElementById('toggle-diet');
    if (dietPlan && toggleBtn) {
        dietPlan.classList.toggle('hidden');
        toggleBtn.textContent = dietPlan.classList.contains('hidden') ? 'Show Diet Plan' : 'Hide Diet Plan';
        speak(dietPlan.classList.contains('hidden') ? 'Diet plan hidden' : 'Diet plan shown');
    }
}

function handleKeyboardNavigation(e) {
    if (e.key === 'Escape') {
        const accessibilityInfo = document.getElementById('accessibility-info');
        if (accessibilityInfo) {
            accessibilityInfo.classList.toggle('hidden');
        }
    }
}

function announceScreenChange(screenId) {
    const screenNames = {
        'home': 'Home',
        'user-type-screen': 'User Type Selection',
        'normal-user-form': 'Normal User Form',
        'disabled-user-form': 'Disabled User Form',
        'bmi-result': 'BMI Result',
        'recommendations': 'Recommendations',
        'about': 'About Us',
        'services': 'Our Services',
        'contact': 'Contact Us'
    };
    speak(`Now showing ${screenNames[screenId] || screenId} screen`);
}

// Automatically speak the content of new pages
document.addEventListener('DOMContentLoaded', () => {
    const h1 = document.querySelector('h1');
    if (h1) {
        speak(h1.textContent);
    }
});


 const disabilities = [
            {
                name: "Vision Impairment",
                exercise: [
                    "Eye Focus Shifting: 5 times (3x/day) - Focus on a near object, then a far object, alternating for 30 seconds.",
                    "Palming: 1 minute (3x/day) - Cover your eyes with your palms, relaxing the muscles around your eyes.",
                    "Eye Circles: 10 each direction (2x/day) - Roll your eyes in a circular motion, both clockwise and counterclockwise.",
                    "Distance Staring: 2 minutes (2x/day) - Focus on an object at least 20 feet away, then shift to a closer object.",
                    "Blinking Exercises: 20 blinks (4x/day) - Blink rapidly for 2 seconds, then close your eyes for 3 seconds.",
                    "Figure-8 Eye Movement: Trace a figure-8 with your eyes for 30 seconds, then reverse direction."
                ],
                diet: [
                    "Leafy greens (spinach, kale) - Rich in lutein and zeaxanthin, which support eye health.",
                    "Omega-3s (salmon, walnuts) - Reduce the risk of dry eyes and macular degeneration.",
                    "Citrus fruits (oranges, grapefruits) - High in vitamin C, which may reduce the risk of cataracts.",
                    "Carrots (beta carotene) - Converted to vitamin A, essential for good vision.",
                    "Eggs - Contain lutein, zeaxanthin, vitamin A, and zinc, all beneficial for eye health.",
                    "Berries (blueberries, strawberries) - Rich in antioxidants that may help prevent eye damage.",
                    "Sweet potatoes - High in beta carotene and vitamin E, supporting overall eye health.",
                    "Lean meats - Contain zinc, which helps vitamin A travel from the liver to the retina."
                ]
            },
            {
                name: "Deaf or Hard of Hearing",
                exercise: [
                    "Speech-Language: 30 minutes daily - Practice pronunciation, lip-reading, and sign language.",
                    "Balance Training: 10 minutes daily - Perform single-leg stands, heel-to-toe walks, and gentle yoga poses.",
                    "Auditory Training: 15 minutes daily - Listen to various sounds and try to identify them (for those with residual hearing).",
                    "Social Interaction: 20 minutes daily - Engage in conversations using preferred communication methods.",
                    "Facial Muscle Exercises: 5 minutes daily - Improve facial expressions for better non-verbal communication.",
                    "Rhythm and Music Therapy: 15 minutes daily - Feel vibrations and practice moving to rhythms."
                ],
                diet: [
                    "Magnesium-rich foods (spinach, almonds) - May help protect against noise-induced hearing loss.",
                    "Omega-3s (sardines, flaxseeds) - May help reduce age-related hearing loss.",
                    "Folate (asparagus, lentils) - May slow down hearing loss.",
                    "Vitamin D (mushrooms, fortified foods) - Deficiency has been linked to hearing loss.",
                    "Zinc (oysters, beef) - Helps support the body's immune system, which is crucial for ear health.",
                    "Potassium (bananas, potatoes) - Helps regulate fluid in the inner ear.",
                    "Vitamin C (bell peppers, broccoli) - Acts as an antioxidant, potentially protecting against free radical damage in the ear.",
                    "Vitamin B12 (eggs, milk) - Deficiency has been associated with tinnitus and noise-induced hearing loss."
                ]
            },
            {
                name: "Mental Health Conditions",
                exercise: [
                    "Deep Breathing: 10 minutes (2x/day) - Practice diaphragmatic breathing to reduce stress and anxiety.",
                    "Yoga: 20 minutes daily - Combine physical postures, breathing techniques, and meditation.",
                    "Aerobic Exercise: 30 minutes (5x/week) - Engage in activities like brisk walking, jogging, or cycling.",
                    "Mindfulness: 15 minutes daily - Practice being present and aware of your thoughts and surroundings.",
                    "Progressive Muscle Relaxation: 10 minutes daily - Tense and relax different muscle groups to reduce physical tension.",
                    "Strength Training: 20 minutes (3x/week) - Use bodyweight exercises or light weights to build strength and confidence."
                ],
                diet: [
                    "Omega-3s (salmon, chia seeds) - May help reduce symptoms of depression and anxiety.",
                    "Probiotics (yogurt, kefir) - Can positively influence the gut-brain axis, potentially improving mood.",
                    "Complex carbs (oats, quinoa) - Provide steady energy and can help regulate serotonin production.",
                    "Leafy greens (spinach, kale) - Rich in folate, which may help alleviate depression symptoms.",
                    "Berries (blueberries, strawberries) - High in antioxidants, which may help manage inflammation linked to anxiety and depression.",
                    "Nuts and seeds - Contain tryptophan, zinc, and selenium, which may help reduce depressive symptoms.",
                    "Lean proteins (chicken, turkey) - Contain amino acids necessary for neurotransmitter production.",
                    "Dark chocolate - Contains compounds that may improve mood and reduce stress hormones."
                ]
            },
            {
                name: "Intellectual Disability",
                exercise: [
                    "Cognitive Games: 20 minutes (3x/week) - Engage in puzzles, memory games, and problem-solving activities.",
                    "Aerobic Activity: 30 minutes (3-4x/week) - Participate in swimming, dancing, or adapted sports.",
                    "Stretching: 10 minutes daily - Perform gentle stretches to improve flexibility and body awareness.",
                    "Social Games: 2-3 times/week - Play team games or interactive activities to enhance social skills.",
                    "Fine Motor Skills: 15 minutes daily - Practice activities like drawing, coloring, or using building blocks.",
                    "Balance and Coordination: 15 minutes (3x/week) - Engage in activities like catching a ball or walking on a line."
                ],
                diet: [
                    "Protein-rich foods (eggs, chicken) - Support brain function and neurotransmitter production.",
                    "Leafy vegetables (spinach, broccoli) - Provide essential nutrients for cognitive health.",
                    "Healthy fats (avocados, olive oil) - Support brain cell structure and function.",
                    "Fruits & whole grains (berries, brown rice) - Provide antioxidants and steady energy for brain function.",
                    "Omega-3 fatty acids (fatty fish, flaxseeds) - Support brain development and function.",
                    "Iron-rich foods (lean meats, beans) - Essential for cognitive development and function.",
                    "Zinc-rich foods (pumpkin seeds, beef) - Important for memory and thinking skills.",
                    "Vitamin B12 (fortified cereals, dairy products) - Supports nervous system function and cognitive health."
                ]
            },
            {
                name: "Acquired Brain Injury (ABI)",
                exercise: [
                    "Cognitive Rehab: 20 minutes (3x/week) - Engage in memory exercises, attention tasks, and problem-solving activities.",
                    "Balance Training: 10 minutes (2x/day) - Practice standing on one foot, walking heel-to-toe, or using a balance board.",
                    "Strength Training: 15 minutes (3x/week) - Use resistance bands or light weights to improve muscle strength.",
                    "Aerobic Activity: 30 minutes (5x/week) - Engage in low-impact activities like swimming or stationary cycling.",
                    "Fine Motor Skills: 15 minutes daily - Practice activities like writing, drawing, or manipulating small objects.",
                    "Speech and Language Exercises: 20 minutes daily - Work on articulation, word-finding, and comprehension tasks."
                ],
                diet: [
                    "High-protein foods (chicken, fish) - Support tissue repair and neurotransmitter production.",
                    "Antioxidants (blueberries, dark chocolate) - Help protect brain cells from oxidative stress.",
                    "Healthy fats (nuts, avocados) - Support brain cell structure and reduce inflammation.",
                    "B vitamins (eggs, leafy greens) - Essential for brain function and energy metabolism.",
                    "Omega-3 fatty acids (fatty fish, flaxseeds) - Support brain health and may reduce inflammation.",
                    "Vitamin D (fortified dairy, sunlight exposure) - Important for neurotransmitter function and neuroprotection.",
                    "Magnesium-rich foods (spinach, pumpkin seeds) - May help improve cognitive function and reduce headaches.",
                    "Turmeric - Contains curcumin, which has anti-inflammatory and neuroprotective properties."
                ]
            },
            {
                name: "Autism Spectrum Disorder (ASD)",
                exercise: [
                    "Sensory Activities: 15 minutes daily - Engage in activities that provide sensory input, like playing with textured objects or listening to calming sounds.",
                    "Strength & Coordination: 20 minutes (3x/week) - Practice activities like climbing, jumping, or throwing and catching a ball.",
                    "Structured Play: 30 minutes daily - Engage in activities with clear rules and steps, like building with blocks or completing puzzles.",
                    "Mindfulness: 10 minutes (2x/day) - Practice simple breathing exercises or guided imagery suitable for the individual's level.",
                    "Social Skills Practice: 15 minutes daily - Role-play social situations or practice turn-taking in games.",
                    "Fine Motor Skills: 15 minutes daily - Engage in activities like drawing, using scissors, or manipulating small objects."
                ],
                diet: [
                    "Whole foods (fruits, vegetables) - Provide essential nutrients and fiber for gut health.",
                    "Omega-3s (salmon, chia seeds) - May help with focus and reducing inflammation.",
                    "Gluten-free/Dairy-free options (if sensitive) - Some individuals with ASD may benefit from eliminating these foods.",
                    "High-fiber foods (apples, lentils) - Support digestive health, which may influence behavior and mood.",
                    "Probiotic-rich foods (yogurt, kefir) - May help with gut health and potentially influence behavior.",
                    "Lean proteins (chicken, turkey) - Provide amino acids necessary for neurotransmitter production.",
                    "Vitamin D-rich foods (fortified milk, egg yolks) - May help with focus and reducing repetitive behaviors.",
                    "Magnesium-rich foods (spinach, pumpkin seeds) - May help with sleep and reducing anxiety."
                ]
            },
            {
                name: "Physical Disability",
                exercise: [
                    "Adaptive Yoga: 30 minutes daily - Practice modified yoga poses suitable for individual abilities.",
                    "Resistance Band Training: 15 minutes (3x/week) - Use resistance bands to strengthen muscles.",
                    "Range of Motion: 15 minutes daily - Perform gentle stretches and movements to maintain flexibility.",
                    "Wheelchair Aerobics: 20 minutes (3-5x/week) - Engage in upper body movements and wheelchair propulsion for cardiovascular health.",
                    "Seated Tai Chi: 15 minutes daily - Practice slow, flowing movements to improve balance and reduce stress.",
                    "Aquatic Exercises: 30 minutes (2-3x/week) - Perform exercises in water to reduce joint stress and improve mobility."
                ],
                diet: [
                    "High-protein foods (chicken, beans) - Support muscle maintenance and repair.",
                    "Calcium-rich foods (milk, fortified plant milk) - Maintain bone health, especially important for those with limited mobility.",
                    "Healthy fats (nuts, olive oil) - Provide energy and support overall health.",
                    "High-fiber foods (whole grains, vegetables) - Promote digestive health and prevent constipation.",
                    "Iron-rich foods (lean meats, spinach) - Prevent anemia, which can be common in some physical disabilities.",
                    "Vitamin D (fatty fish, fortified foods) - Support bone health and immune function.",
                    "Antioxidant-rich foods (berries, leafy greens) - Help reduce inflammation and support overall health.",
                    "Hydration (water, herbal teas) - Maintain proper hydration, especially important for those with limited mobility."
                ]
            },
            {
                
                name: "Dyslexia",
                exercise: [
                    "Reading Exercises: 20 minutes daily - Practice reading aloud, focusing on phonics and word recognition.",
                    "Eye-Tracking: 10 minutes (2x/day) - Follow a moving object with your eyes without moving your head.",
                    "Memory Games: 15 minutes (3x/week) - Play card matching games or use apps designed for memory improvement.",
                    "Cross-Lateral Movements: 15 minutes daily - Perform exercises that cross the body's midline, like touching opposite knee to elbow.",
                    "Spelling Practice: 15 minutes daily - Use multisensory techniques to practice spelling, like writing words in sand or with playdough.",
                    "Rhythm and Timing Exercises: 10 minutes daily - Practice clapping or tapping to a beat, which can help with reading fluency."
                ],
                diet: [
                    "Antioxidants (berries, dark chocolate) - Support overall brain health.",
                    "High-fiber foods (whole grains, legumes) - Provide steady energy for focus and concentration.",
                    "Omega-3s (fish, walnuts) - Support brain function and may improve reading ability.",
                    "B vitamins (eggs, leafy greens) - Essential for cognitive function and energy metabolism.",
                    "Iron-rich foods (lean meats, spinach) - Important for cognitive development and function.",
                    "Zinc (pumpkin seeds, beef) - Plays a role in memory and cognitive processing.",
                    "Vitamin D (fatty fish, fortified foods) - May play a role in cognitive function and reading ability.",
                    "Protein-rich foods (chicken, tofu) - Provide amino acids necessary for neurotransmitter production."
                ]
            },
            {
                name: "Dysgraphia",
                exercise: [
                    "Fine Motor Exercises: 15 minutes daily - Practice activities like using tweezers to pick up small objects or threading beads.",
                    "Grip Strengthening: 5 minutes (2-3x/day) - Use stress balls or putty to improve hand strength.",
                    "Handwriting Practice: 10 minutes daily - Focus on letter formation and spacing using specialized paper or apps.",
                    "Coordination Exercises: 10 minutes daily - Practice activities that involve hand-eye coordination, like catching a ball.",
                    "Tracing Exercises: 10 minutes daily - Trace shapes, letters, or patterns to improve motor control.",
                    "Finger Tapping: 5 minutes daily - Tap each finger to the thumb in sequence to improve dexterity."
                ],
                diet: [
                    "Protein-rich foods (eggs, lean meats) - Support muscle development and repair in hands and fingers.",
                    "Antioxidant foods (berries, leafy greens) - Support overall brain health.",
                    "Healthy fats (avocados, nuts) - Provide energy and support brain function.",
                    "Complex carbs (oats, quinoa) - Offer steady energy for focus during writing tasks.",
                    "Omega-3 fatty acids (fatty fish, chia seeds) - Support brain health and may improve motor skills.",
                    "Vitamin B12 (fortified cereals, dairy) - Important for nerve function and fine motor control.",
                    "Magnesium-rich foods (spinach, almonds) - May help with muscle function and reducing hand fatigue.",
                    "Vitamin D (fortified milk, egg yolks) - Supports muscle function and may improve motor skills."
                ]
            },
            {
                name: "Dyscalculia",
                exercise: [
                    "Math Games: 15 minutes (3-4x/week) - Play games that involve counting, sorting, or basic calculations.",
                    "Spatial Awareness: 20 minutes (3x/week) - Practice activities like puzzles or building with blocks.",
                    "Mental Math Practice: 10 minutes daily - Start with simple calculations and gradually increase difficulty.",
                    "Cross-Lateral Movements: 10 minutes (2x/day) - Perform exercises that cross the body's midline to improve brain connectivity.",
                    "Number Line Activities: 15 minutes daily - Use a physical or imaginary number line to visualize mathematical concepts.",
                    "Pattern Recognition: 10 minutes daily - Practice identifying and continuing patterns in numbers or shapes."
                ],
                diet: [
                    "High omega-3 foods (salmon, flaxseeds) - Support brain function and may improve mathematical abilities.",
                    "Antioxidants (berries, dark leafy greens) - Protect brain cells and support overall cognitive health.",
                    "Complex carbs (whole grains, legumes) - Provide steady energy for focus and concentration.",
                    "Lean proteins (chicken, tofu) - Supply amino acids necessary for neurotransmitter production.",
                    "Zinc-rich foods (pumpkin seeds, beef) - Important for memory and cognitive processing.",
                    "Iron-rich foods (spinach, lentils) - Essential for cognitive development and function.",
                    "Vitamin B12 (eggs, dairy products) - Supports nervous system function and cognitive health.",
                    "Vitamin D (fatty fish, fortified foods) - May play a role in cognitive function and mathematical abilities."
                ]
            },
            {
                name: "ADHD",
                exercise: [
                    "Aerobic Exercise: 30 minutes (4-5x/week) - Engage in activities like running, swimming, or cycling to improve focus and reduce hyperactivity.",
                    "Yoga/Mindfulness: 15 minutes daily - Practice yoga poses and mindfulness techniques to improve attention and reduce stress.",
                    "Strength Training: 20 minutes (3x/week) - Use bodyweight exercises or light weights to improve body awareness and focus.",
                    "Brain Training Games: 15 minutes daily - Use apps or games designed to improve working memory and attention.",
                    "Balance Exercises: 10 minutes daily - Practice activities like standing on one foot or using a balance board to improve focus and coordination.",
                    "Rhythmic Activities: 15 minutes daily - Engage in activities like dancing or drumming to improve timing and attention."
                ],
                diet: [
                    "High-protein foods (eggs, lean meats) - Help stabilize blood sugar and improve focus.",
                    "Complex carbs (whole grains, vegetables) - Provide steady energy and support attention.",
                    "Omega-3s (fish, walnuts) - May help improve focus and reduce ADHD symptoms.",
                    "Iron-rich foods (spinach, lentils) - Important for attention and cognitive function.",
                    "Zinc-rich foods (oysters, pumpkin seeds) - May help with attention and hyperactivity.",
                    "Magnesium-rich foods (almonds, black beans) - May help with sleep and reducing hyperactivity.",
                    "Vitamin B-rich foods (leafy greens, lean meats) - Support overall brain function and energy metabolism.",
                    "Probiotic-rich foods (yogurt, kefir) - May help with gut health, which can influence ADHD symptoms."
                ]
            },
            {
                name: "Neurodevelopmental Motor Disorders",
                exercise: [
                    "Fine Motor Skills: 15 minutes daily - Practice activities like drawing, using scissors, or manipulating small objects.",
                    "Balance Training: 10 minutes (2x/day) - Practice standing on one foot, walking on a line, or using a balance board.",
                    "Gross Motor Activities: 20 minutes (3-4x/week) - Engage in activities like throwing and catching a ball, jumping, or climbing.",
                    "Stretching: 10 minutes daily - Perform gentle stretches to improve flexibility and body awareness.",
                    "Coordination Exercises: 15 minutes daily - Practice activities that involve hand-eye coordination, like hitting a target.",
                    "Sensory Integration: 20 minutes daily - Engage in activities that provide various sensory inputs, like playing with different textures."
                ],
                diet: [
                    "Protein-rich foods (chicken, fish) - Support muscle development and repair.",
                    "Omega-3s (fatty fish, chia seeds) - Support brain health and may improve motor skills.",
                    "Antioxidants (blueberries, spinach) - Protect brain cells and support overall health.",
                    "Calcium-rich foods (dairy, fortified plant milk) - Support bone health and muscle function.",
                    "Iron-rich foods (lean meats, beans) - Important for energy and muscle function.",
                    "Vitamin D (egg yolks, fortified foods) - Supports muscle function and may improve motor skills.",
                    "B vitamins (whole grains, eggs) - Support nervous system function and energy metabolism.",
                    "Magnesium-rich foods (nuts, seeds) - Important for muscle and nerve function."
                ]
            }
        ];

        const cardContainer = document.getElementById('card-container');
        const modal = document.getElementById('modal');
        const modalTitle = document.getElementById('modal-title');
        const modalBody = document.getElementById('modal-body');
        const closeBtn = document.getElementsByClassName('close')[0];

        disabilities.forEach(disability => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-content">
                    <h3>${disability.name}</h3>
                </div>
            `;
            card.addEventListener('click', () => showModal(disability));
            cardContainer.appendChild(card);
        });

        function showModal(disability) {
            modalTitle.textContent = disability.name;
            modalBody.innerHTML = `
                <h3>Exercise Plan</h3>
                <ul>
                    ${disability.exercise.map(item => `<li>${item}</li>`).join('')}
                </ul>
                <h3>Diet Plan</h3>
                <ul>
                    ${disability.diet.map(item => `<li>${item}</li>`).join('')}
                </ul>
            `;
            modal.style.display = 'block';
        }

        closeBtn.onclick = function() {
            modal.style.display = 'none';
        }

        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        }


let currentFontSize = parseFloat(getComputedStyle(document.body).fontSize);


function adjustButtonSizes() {
    const buttons = document.querySelectorAll('.font-size-controls button');
    buttons.forEach(button => {
        button.style.fontSize = `${currentFontSize}px`; 
        button.style.padding = `${currentFontSize / 16}px ${currentFontSize / 8}px`; 
    });
}

function increaseFontSize() {
    currentFontSize += 2; 
    document.body.style.fontSize = `${currentFontSize}px`;
    adjustButtonSizes(); 
}

function decreaseFontSize() {
    currentFontSize = Math.max(10, currentFontSize - 2); 
    document.body.style.fontSize = `${currentFontSize}px`;
    adjustButtonSizes(); 
}


document.getElementById('increaseBtn').addEventListener('click', increaseFontSize);
document.getElementById('decreaseBtn').addEventListener('click', decreaseFontSize);
