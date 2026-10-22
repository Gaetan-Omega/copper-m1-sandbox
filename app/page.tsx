import { Tag } from "lucide-react";
import Image from "next/image";
import { SiteFooter } from "@/components/copper/site-footer";
import { SiteHeader } from "@/components/copper/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatMemory,
  formatNotesHours,
  formatUsd,
  getPlans,
  getPrivacySummary,
  getProducts,
  type Product,
} from "@/lib/copper/catalog";

const TAGLINE = "From raw ideas to refined answers.";

// The product card that gets a "Sale" tag on its image.
const SALE_PRODUCT_ID = "copper-notes";

const CUTOUT_ALT: Record<string, string> = {
  "copper-home": "Copper Home, a copper-colored AI smart speaker",
  "copper-notes": "Copper Notes, a small copper clip-on AI recorder",
};

const LIFESTYLE: Record<string, { alt: string; caption: string }> = {
  "copper-home-desert-light": {
    alt: "Copper Home speaker on a shelf in warm desert light",
    caption: "Copper Home brings the house together, even in desert light.",
  },
  "copper-notes-stone-desk": {
    alt: "Copper Notes recorder clipped on a notebook on a stone desk",
    caption: "Copper Notes keeps every meeting and lecture on the record.",
  },
  "copper-notes-golden-hour": {
    alt: "Copper Notes recorder worn outdoors at golden hour",
    caption: "Copper Notes goes wherever the day takes you.",
  },
};

const lifestyleKey = (path: string) =>
  path.split("/").pop()!.replace(/\.png$/, "");

// Side-by-side comparison; every value comes from the catalog.
function ComparisonBox({ products }: { products: Product[] }) {
  const rows: { label: string; value: (product: Product) => React.ReactNode }[] =
    [
      { label: "Type", value: (product) => product.type },
      { label: "Price", value: (product) => formatUsd(product.priceUsd) },
      { label: "Colors", value: (product) => product.colors.join(", ") },
      {
        label: "Key features",
        value: (product) => (
          <ul className="space-y-1">
            {product.features.map((feature) => (
              <li key={feature.name}>{feature.name}</li>
            ))}
          </ul>
        ),
      },
    ];
  return (
    <Card className="mt-10" aria-label="Compare Copper products">
      <CardHeader>
        <CardTitle className="text-2xl">Compare the products</CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-32" />
              {products.map((product) => (
                <TableHead key={product.id} className="text-primary text-base">
                  {product.name}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableCell className="font-semibold">{row.label}</TableCell>
                {products.map((product) => (
                  <TableCell key={product.id} className="whitespace-normal">
                    {row.value(product)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <Card data-testid="product-card" data-product={product.id}>
      <CardHeader>
        <div className="bg-secondary relative mb-2 rounded-xl p-4">
          {product.id === SALE_PRODUCT_ID && (
            <Badge className="absolute top-3 right-3 z-10 h-7 -rotate-6 gap-1.5 px-3 text-sm font-bold shadow-md">
              <Tag aria-hidden="true" className="-rotate-90" />
              Sale
            </Badge>
          )}
          <Image
            src={product.cutout}
            alt={CUTOUT_ALT[product.id] ?? product.name}
            width={1254}
            height={1254}
            sizes="(min-width: 768px) 400px, 90vw"
            className="mx-auto h-auto w-full max-w-xs"
          />
        </div>
        <p className="text-muted-foreground text-sm">{product.type}</p>
        <CardTitle className="flex items-baseline justify-between gap-2 text-2xl">
          <span>{product.name}</span>
          <span className="text-primary">{formatUsd(product.priceUsd)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ul className="space-y-2">
          {product.features.map((feature) => (
            <li key={feature.name}>
              <span className="font-semibold">{feature.name}.</span>{" "}
              <span className="text-muted-foreground">
                {feature.description}
              </span>
            </li>
          ))}
        </ul>
        <p className="text-muted-foreground text-sm">
          Colors: {product.colors.join(", ")}
        </p>
      </CardContent>
    </Card>
  );
}

export default function Home() {
  const products = getProducts();
  const plans = getPlans();
  const privacy = getPrivacySummary();
  const free = plans.find((plan) => plan.id === "free")!;
  const plus = plans.find((plan) => plan.id === "copper-plus")!;
  const showcase = products.flatMap((product) =>
    product.lifestyle.map((src) => ({ product, src })),
  );

  return (
    <>
      <SiteHeader />
      <main className="flex-1">
        <section
          data-testid="hero"
          id="top"
          className="bg-secondary scroll-mt-16"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 py-12 md:grid-cols-2 md:py-20">
            <div className="space-y-6">
              <h1 className="text-4xl font-extrabold sm:text-5xl">
                Meet Copper, the AI that fits your life
              </h1>
              <p className="text-xl">{TAGLINE}</p>
              <Button asChild size="lg">
                <a href="#products">See products</a>
              </Button>
            </div>
            <div className="grid grid-cols-2 items-end gap-2">
              {products.map((product) => (
                <Image
                  key={product.id}
                  src={product.cutout}
                  alt={CUTOUT_ALT[product.id] ?? product.name}
                  width={1254}
                  height={1254}
                  priority
                  sizes="(min-width: 768px) 280px, 45vw"
                  className="h-auto w-full"
                />
              ))}
            </div>
          </div>
        </section>

        <section
          data-testid="products"
          id="products"
          className="mx-auto max-w-6xl scroll-mt-16 px-4 py-16"
        >
          <h2 className="mb-8 text-3xl font-bold">Meet the products</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <ComparisonBox products={products} />
        </section>

        <section
          data-testid="showcase"
          id="showcase"
          className="bg-muted scroll-mt-16"
        >
          <div className="mx-auto max-w-6xl space-y-10 px-4 py-16">
            <h2 className="text-3xl font-bold">Copper in the real world</h2>
            <div className="grid gap-8 md:grid-cols-2">
              {showcase.map(({ src }) => {
                const photo = LIFESTYLE[lifestyleKey(src)];
                return (
                  <figure key={src} className="space-y-3">
                    <Image
                      src={src}
                      alt={photo?.alt ?? "Copper product in everyday use"}
                      width={1672}
                      height={941}
                      sizes="(min-width: 768px) 560px, 95vw"
                      className="h-auto w-full rounded-xl"
                    />
                    <figcaption className="text-muted-foreground">
                      {photo?.caption ?? "Copper in everyday use."}
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </section>

        <section
          data-testid="plus-pricing"
          id="plus"
          className="mx-auto max-w-4xl scroll-mt-16 px-4 py-16"
        >
          <h2 className="mb-2 text-3xl font-bold">Copper Plus</h2>
          <p className="text-muted-foreground mb-8">
            Start free, or upgrade for a longer memory and unlimited Notes.
          </p>
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{free.name}</CardTitle>
                <p className="text-3xl font-bold">
                  {formatUsd(free.monthlyUsd)}
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Memory kept: {formatMemory(free.memoryDays)}</li>
                  <li>
                    Notes recording: {formatNotesHours(free.notesHoursPerMonth)}
                  </li>
                  <li>
                    Refined answers: {free.refinedAnswers ? "Included" : "No"}
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="border-primary border-2">
              <CardHeader>
                <CardTitle className="text-primary text-2xl">
                  {plus.name}
                </CardTitle>
                <p className="text-3xl font-bold">
                  {formatUsd(plus.monthlyUsd)}
                  <span className="text-muted-foreground text-base font-normal">
                    /month
                  </span>
                </p>
                <p className="text-muted-foreground">
                  or {formatUsd(plus.annualUsd)}/year
                </p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>Memory kept: {formatMemory(plus.memoryDays)}</li>
                  <li>
                    Notes recording: {formatNotesHours(plus.notesHoursPerMonth)}
                  </li>
                  <li>
                    Refined answers: {plus.refinedAnswers ? "Included" : "No"}
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </section>

        <section
          data-testid="privacy-summary"
          id="privacy"
          className="bg-accent text-accent-foreground scroll-mt-16"
        >
          <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
            <h2 className="text-3xl font-bold">
              Your privacy, under the {privacy.policy} policy
            </h2>
            <ul className="list-disc space-y-3 pl-5">
              {privacy.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
