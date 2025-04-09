import { parse } from "csv-parse";
import { createReadStream, writeFileSync, readdirSync } from "fs";
import { faker } from "@faker-js/faker";

// Interfaces para los datos
interface Product {
  name: string;
  isin: string;
  symbol: string;
}

interface SearchData {
  count: number;
  result: { description: string; isin: string; symbol: string; type: string }[];
}

interface QuoteData {
  currentPrice: number;
  highPrice: number;
  lowPrice: number;
  openPrice: number;
  previousClosePrice: number;
  timestamp: number;
}

// Objetos para almacenar los datos generados
const mockSearchData: { [query: string]: SearchData } = {};
const mockQuoteData: { [isin: string]: QuoteData } = {};

// Leer todos los archivos CSV en src/data/products/
const products: Product[] = [];
const productDir = "src/data";

// Función para leer un archivo CSV y devolver una promesa
const readCsvFile = (filePath: string): Promise<Product[]> => {
  return new Promise((resolve, reject) => {
    const fileProducts: Product[] = [];
    createReadStream(filePath)
      .pipe(parse({ delimiter: ",", columns: true }))
      .on("data", (row: Product) => {
        fileProducts.push(row);
      })
      .on("end", () => {
        resolve(fileProducts);
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};

// Leer todos los archivos de forma secuencial
const files = readdirSync(productDir).filter((file) => file.endsWith(".csv"));

// Usar una IIFE para manejar la lógica asíncrona
(async () => {
  for (const file of files) {
    console.log(`Leyendo archivo: ${file}`);
    try {
      const fileProducts = await readCsvFile(`${productDir}/${file}`);
      products.push(...fileProducts);
    } catch (error) {
      console.error(`Error al leer el archivo ${file}:`, error);
    }
  }

  console.log("CSV leídos. Generando datos mockeados...");

  // Generar datos para cada producto
  products.forEach((product) => {
    const query = product.name.toLowerCase().split(" ")[0];
    const isin = product.isin === "N/A" ? product.symbol : product.isin;
    const symbol = product.symbol;

    // Determinar el tipo de producto
    let type = "Common Stock";
    if (symbol.startsWith("FX-")) type = "Forex";
    else if (symbol.startsWith("SGB")) type = "Sovereign Gold Bond";
    else if (symbol.includes("ETF")) type = "ETF";
    else if (symbol.includes("BOND")) type = "Bond";
    else if (symbol.includes("MF")) type = "Mutual Fund";

    // Generar datos para /search
    if (!mockSearchData[query]) {
      mockSearchData[query] = { count: 0, result: [] };
    }
    mockSearchData[query].result.push({
      description: product.name,
      isin: isin,
      symbol: symbol,
      type: type,
    });
    mockSearchData[query].count = mockSearchData[query].result.length;

    // Generar datos para /quote
    const basePrice = faker.number.float({
      min: 50,
      max: 500,
      fractionDigits: 2,
    });
    const variation = faker.number.float({
      min: -5,
      max: 5,
      fractionDigits: 2,
    });
    const high = basePrice + Math.abs(variation);
    const low = basePrice - Math.abs(variation);
    const open = faker.number.float({ min: low, max: high, fractionDigits: 2 });
    const previousClose = faker.number.float({
      min: low,
      max: high,
      fractionDigits: 2,
    });

    mockQuoteData[isin] = {
      currentPrice: basePrice,
      highPrice: high,
      lowPrice: low,
      openPrice: open,
      previousClosePrice: previousClose,
      timestamp: faker.date.recent().getTime() / 1000,
    };
  });

  // Guardar los datos generados en un archivo JSON
  writeFileSync(
    "src/data/mockData.json",
    JSON.stringify({ mockSearchData, mockQuoteData }, null, 2)
  );
  console.log(
    "Datos mockeados generados y guardados en src/data/mockData.json"
  );
})();
