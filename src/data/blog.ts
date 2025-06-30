export type BlogPost = {
  id: number
  title: string
  author: string
  date: string
  snippet: string
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: 'How to Stay Healthy in a Busy World',
    author: 'Dr. Jane Doe',
    date: 'June 1, 2025',
    snippet: 'Discover practical ways to maintain your health amidst a hectic schedule...',
    content: `
Balancing work, family, and personal health can feel overwhelming — but it’s possible with small, consistent habits.

**1. Meal Prep & Nutrition:**  
Plan your meals ahead of time. Include fruits, vegetables, whole grains, and lean protein. Avoid skipping meals or relying on processed snacks.

**2. Hydration:**  
Carry a water bottle. Aim for 6–8 glasses daily, and reduce sugary drinks.

**3. Movement Matters:**  
Take short walks during breaks. Try desk exercises or 10-minute home workouts — consistency is more important than intensity.

**4. Sleep & Rest:**  
Sleep recharges your mind and body. Prioritize 7–8 hours each night and avoid screens before bed.

**5. Mental Health:**  
Practice deep breathing, mindfulness, or journaling. Your mental well-being is as important as your physical health.

Start small. One habit at a time can lead to lasting change.
    `,
  },
  {
    id: 2,
    title: '5 Signs You Should See a Doctor',
    author: 'Dr. John Smith',
    date: 'June 10, 2025',
    snippet: 'Ignoring these symptoms could be harmful. Learn when to take action...',
    content: `
Your body often gives early signals that something isn't right. Pay attention to these five key symptoms:

**1. Persistent Fatigue:**  
Tiredness that doesn't improve with rest could be related to thyroid issues, anemia, or more serious conditions.

**2. Sudden Weight Loss:**  
Unexplained weight loss could signal issues like diabetes, depression, or even cancer.

**3. Continuous Pain:**  
Chronic pain in the chest, stomach, or joints should not be ignored — it may be a sign of inflammation or organ problems.

**4. Changes in Bowel or Bladder Habits:**  
Blood in urine/stool, frequent urination, or long-term constipation may point to infections or gastrointestinal issues.

**5. Shortness of Breath:**  
Struggling to breathe — especially at rest — is a red flag. This could relate to asthma, heart problems, or anxiety.

When in doubt, see a healthcare provider early. Prevention is better than cure.
    `,
  },
  {
    id: 3,
    title: 'Understanding Mental Health: A Beginner’s Guide',
    author: 'Dr. Angela Moore',
    date: 'June 18, 2025',
    snippet: 'Mental health matters. Learn the basics and how to protect your emotional well-being...',
    content: `
Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act.

**Common Mental Health Issues:**  
- Anxiety Disorders  
- Depression  
- PTSD  
- Bipolar Disorder  

**Early Warning Signs:**  
- Withdrawing from social activities  
- Sleeping too much or too little  
- Feeling helpless or hopeless  
- Extreme mood changes

**Tips to Improve Mental Health:**  
1. **Talk to Someone:** A friend, family member, or therapist. Don’t isolate.  
2. **Practice Mindfulness:** Meditation, gratitude journaling, or breathing exercises.  
3. **Exercise Regularly:** Movement improves mood by releasing endorphins.  
4. **Limit Alcohol & Drugs:** These can worsen symptoms.  
5. **Seek Professional Help:** Therapy and counseling are powerful tools for recovery.

Remember: mental health is just as vital as physical health. You are not alone.
    `,
  },
]
