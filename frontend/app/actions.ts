export async function getScore({ formData }: { formData: FormData }) {
  //   let res = await fetch("/getScore", {
  //     method: "POST",
  //     body: formData,
  //     headers: {
  //       "Content-Type": "multipart/form-data",
  //     },
  //   });

  let res = {
    score: 86,
    metrics: {
      filler_words: {
        count: 2,
        status: "pass",
        message: "You got less than 3 filler words",
      },
      tone: {
        status: "fail",
        message: "Your tone was too monotone",
      },
      speed: {
        status: "fail",
        message: "You talked too fast",
        words_per_minute: 180,
      },
      volume: {
        status: "pass",
        message: "You talked loud enough",
      },
    },
  };
}
