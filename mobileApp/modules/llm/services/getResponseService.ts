const messages = [
  {
    role: "user",
    content: "Kaj mi lahko poveš o prehrani pikapolonice v slovenščini",
  },
  {
    role: "assistant",
    content:
      "Prehrana pikapolonice je zelo pomembna za njeno zdravje in rast. Pikapolonice so mesojedci, kar pomeni, da potrebujejo dieto, ki je bogata z beljakovinami in maščobami.\n\n**Prehrana pikapolonice:**\n\n1. **Žuželke**: Pikapolonice se hranijo z različnimi vrstami žuželk, kot so cvrčki, ščurki, muhe in komarji. Žuželke so bogate z beljakovinami in so pomembna vir energije za pikapolonice.\n2. **Ličinke**: Ličinke različnih vrst žuželk, kot so ličinke muh in komarjev, so tudi pomemben del prehrane pikapolonice.\n3. **Plenilci**: Pikapolonice se hranijo tudi z različnimi vrstami plenilcev, kot so miši, podgane in drugi majhni sesalci.\n4. **Sadje in zelenina**: Pikapolonice tudi jedo sadje in zelenino, kot so jagode, maline, korenje in listi.\n5. **Suplementi**: V ujetništvu se pikapolonicam dajejo suplementi, kot so vitamin D3 in kalcij, da bi zagotovili njihovo optimalno zdravje.\n\n**Prehranski zahtevi:**\n\n1. **Bela krovina**: Pikapolonice potrebujejo belo krovino, kot so cvrčki ali muhe, kot vir beljakovin.\n2. **Maščobe**: Pikapolonice potrebujejo maščobe, kot so korenje ali listi, za energijo.\n3. **Vitamin D3**: Pikapolonice potrebujejo vitamin D3 za uravnavanje kalcija in fosforja v telesu.\n4. **Kalcij**: Pikapolonice potrebujejo kalcij za rast in razvoj kosti.\n\n**Napake v prehrani:**\n\n1. **Prenizka prehrana**: Prenizka prehrana lahko povzroči oslabelost, slabo zdravje in smrt.\n2. **Nepravilna prehrana**: Nepravilna prehrana lahko povzroči nezdrave navade, kot so jedanje lastnega odpadka ali hrane, ki ni primerna za pikapolonice.\n3. **Pomanjkanje vitamina in mineralov**: Pomanjkanje vitamina in mineralov lahko povzroči težave z zdravjem, kot so krhke kosti ali slab okus.\n\nZaključek: Prehrana pikapolonice je zelo pomembna za njeno zdravje in rast. Pikapolonice potrebujejo dieto, ki je bogata z beljakovinami, maščobami, vitaminom D3 in kalcijem. Pomembno je tudi, da se pikapolonicam dajejo suplementi, kot so vitamin D3 in kalcij, da bi zagotovili njihovo optimalno zdravje.",
  },
  {
    role: "user",
    content: "O čem sva se pogovarjala odgovori na kratko",
  },
];

export async function getModelRespose(
  messages: { role: string; content: string }[]
) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
      }),
    }
  );

  const data = await response.json();
  return data.choices[0].message.content;
}
