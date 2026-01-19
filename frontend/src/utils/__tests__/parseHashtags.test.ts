import { parseHashtags } from "../parseHashtags";

describe("parseHashtags", () => {
  it("returns a single text token when there are no hashtags", () => {
    const result = parseHashtags("Texto normal sin hashtags");

    expect(result).toEqual([
      { type: "text", value: "Texto normal sin hashtags" },
    ]);
  });

  it("parses a single hashtag at the end of the text", () => {
    const result = parseHashtags("Aumenta tu #productividad");

    expect(result).toEqual([
      { type: "text", value: "Aumenta tu " },
      { type: "hashtag", value: "#productividad" },
    ]);
  });

  it("parses a hashtag in the middle of the text", () => {
    const result = parseHashtags("Mejora tu #productividad hoy");

    expect(result).toEqual([
      { type: "text", value: "Mejora tu " },
      { type: "hashtag", value: "#productividad" },
      { type: "text", value: " hoy" },
    ]);
  });

  it("parses multiple hashtags in the same text", () => {
    const result = parseHashtags(
      "Usa #react y #typescript para ser más #productivo",
    );

    expect(result).toEqual([
      { type: "text", value: "Usa " },
      { type: "hashtag", value: "#react" },
      { type: "text", value: " y " },
      { type: "hashtag", value: "#typescript" },
      { type: "text", value: " para ser más " },
      { type: "hashtag", value: "#productivo" },
    ]);
  });

  it("returns an empty array for an empty string", () => {
    const result = parseHashtags("");

    expect(result).toEqual([]);
  });

  it("supports hashtags with numbers and underscores", () => {
    const result = parseHashtags("Prueba #react_18 y #next13");

    expect(result).toEqual([
      { type: "text", value: "Prueba " },
      { type: "hashtag", value: "#react_18" },
      { type: "text", value: " y " },
      { type: "hashtag", value: "#next13" },
    ]);
  });

  it("reconstructs the original text when joining all tokens", () => {
    const text = "Hola #react esto es #typescript";
    const result = parseHashtags(text);

    const reconstructed = result.map((p) => p.value).join("");

    expect(reconstructed).toBe(text);
  });
});
