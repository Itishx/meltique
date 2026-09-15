/**
 * Prepares the MELTYK image library from the Cube shoot.
 *
 * Two sources are full-frame photographs; two are brand sheets whose panels
 * are cropped out here by hand-measured boxes. Panels that are natively
 * landscape are letterboxed onto their own sampled backdrop rather than
 * cropped square, so the product is never cut and the grid stays uniform.
 *
 * Run with: npm run imagery
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import sharp from "sharp";

const ROOT = new URL("..", import.meta.url).pathname;
const SRC = join(ROOT, "assets", "source");
const PUBLIC = join(ROOT, "public");

const A = {
  card: [1000, 1000], // product cards and PDP gallery
  wide: [2000, 1125], // 16:9 full-bleed
  ultra: [2400, 900], // 8:3 banner
  band: [2400, 620], // the "inside the cube" strip
  landscape: [1500, 1000], // 3:2 journal and modules
  box: [1600, 1200], // 4:3 full-frame packaging shots
  boxcard: [1100, 1375], // 4:5 — the per-flavour box cards on the shop page
  tall: [1100, 1467], // 3:4 editorial columns
  poster: [1024, 1536], // 2:3 flavour posters, used at native size
  strip: [1200, 640], // per-flavour cut-cube strips
  og: [1200, 630],
};

/* Hand-measured panel boxes [x, y, w, h]. Both sheets are 1536 x 1024. */
const SYS = {
  brand: [0, 0, 305, 372],
  flavourDark: [305, 75, 323, 297],
  flavourCaramel: [628, 75, 313, 297],
  flavourFruit: [941, 75, 296, 297],
  flavourProtein: [1237, 75, 299, 297],
  insideBand: [0, 375, 1536, 108],
  insideDark: [360, 378, 210, 105],
  insideCaramel: [670, 378, 210, 105],
  insideFruit: [975, 378, 210, 105],
  insideProtein: [1280, 378, 210, 105],
  assortedWide: [30, 520, 1010, 292],
  assortedClosed: [55, 585, 560, 225],
  assortedOpen: [605, 522, 415, 275],
  boxSizes: [1150, 625, 355, 185],
  individual: [50, 848, 295, 120],
  gifting: [396, 848, 382, 120],
  onTheGo: [858, 845, 358, 124],
  signature: [1220, 815, 316, 209],
};

const PROTO = {
  outerBox: [40, 52, 715, 426],
  wrapDark: [40, 518, 345, 209],
  wrapCaramel: [395, 518, 360, 209],
  wrapFruit: [768, 518, 372, 209],
  wrapProtein: [1150, 518, 350, 209],
  wrappers: [0, 762, 378, 216],
  cubeCloseUp: [585, 762, 380, 216],
  signature: [1185, 762, 350, 216],
};

/** Columns of wrapped cubes inside the full-frame open-box photograph. */
const BOX = {
  dark: [265, 425, 310, 310],
  caramel: [525, 400, 310, 310],
  fruit: [775, 380, 310, 310],
  protein: [1015, 345, 310, 310],
  all: [190, 300, 1180, 700],
};

const px = (box) => ({ px: box });
/** Letterbox onto a backdrop sampled from the panel, rather than cropping. */
const fit = (box) => ({ px: box, contain: true });

const PLAN = [
  /* --------------------------------------------------------- cube flavours */
  { out: "products/cube-classic-dark/1.jpg", src: "sheet-system", ...px(SYS.flavourDark), aspect: "card" },
  { out: "products/cube-classic-dark/2.jpg", src: "open-box", ...px(BOX.dark), aspect: "card" },
  { out: "products/cube-classic-dark/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrapDark), aspect: "card" },

  { out: "products/cube-caramel/1.jpg", src: "sheet-system", ...px(SYS.flavourCaramel), aspect: "card" },
  { out: "products/cube-caramel/2.jpg", src: "open-box", ...px(BOX.caramel), aspect: "card" },
  { out: "products/cube-caramel/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrapCaramel), aspect: "card" },

  { out: "products/cube-fruit-nut/1.jpg", src: "sheet-system", ...px(SYS.flavourFruit), aspect: "card" },
  { out: "products/cube-fruit-nut/2.jpg", src: "open-box", ...px(BOX.fruit), aspect: "card" },
  { out: "products/cube-fruit-nut/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrapFruit), aspect: "card" },

  { out: "products/cube-protein/1.jpg", src: "sheet-system", ...px(SYS.flavourProtein), aspect: "card" },
  { out: "products/cube-protein/2.jpg", src: "open-box", ...px(BOX.protein), aspect: "card" },
  { out: "products/cube-protein/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrapProtein), aspect: "card" },

  /* -------------------------------------------------------------- formats */

  { out: "products/craft-box-70/1.jpg", src: "craft-box", ...fit([300, 110, 1040, 780]), aspect: "card" },
  { out: "products/craft-box-70/2.jpg", src: "craft-box", ...px([430, 380, 500, 500]), aspect: "card" },
  { out: "products/craft-box-70/3.jpg", src: "craft-box", ...px([820, 200, 500, 500]), aspect: "card" },

  { out: "products/gift-box/1.jpg", src: "sheet-system", ...fit(SYS.gifting), aspect: "card" },
  { out: "products/gift-box/2.jpg", src: "sheet-system", ...fit(SYS.assortedClosed), aspect: "card" },
  { out: "products/gift-box/3.jpg", src: "craft-box", ...fit([300, 110, 1040, 780]), aspect: "card" },

  { out: "products/on-the-go-tube/1.jpg", src: "sheet-system", ...fit(SYS.onTheGo), aspect: "card" },
  { out: "products/on-the-go-tube/2.jpg", src: "sheet-system", ...fit(SYS.individual), aspect: "card" },
  { out: "products/on-the-go-tube/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrappers), aspect: "card" },

  { out: "products/single-cube/1.jpg", src: "sheet-prototype", ...px(PROTO.cubeCloseUp), aspect: "card" },
  { out: "products/single-cube/2.jpg", src: "sheet-system", ...fit(SYS.individual), aspect: "card" },
  { out: "products/single-cube/3.jpg", src: "sheet-prototype", ...fit(PROTO.wrappers), aspect: "card" },

  /* ------------------------------------------------------------ editorial */
  { out: "editorial/hero.jpg", src: "open-box", crop: [0, 0, 1, 1], aspect: "wide" },
  { out: "editorial/hero-ultra.jpg", src: "open-box", crop: [0, 0.06, 1, 0.86], aspect: "ultra" },
  { out: "editorial/cube-macro.jpg", src: "sheet-prototype", ...px(PROTO.cubeCloseUp), aspect: "landscape" },
  { out: "editorial/cube-macro-wide.jpg", src: "sheet-prototype", ...px(PROTO.cubeCloseUp), aspect: "wide" },
  { out: "editorial/inside-the-cube.jpg", src: "sheet-system", ...px(SYS.insideBand), aspect: "band" },
  { out: "editorial/wrappers.jpg", src: "sheet-prototype", ...px(PROTO.wrappers), aspect: "landscape" },
  { out: "editorial/craft-box.jpg", src: "craft-box", crop: [0, 0, 1, 1], aspect: "wide" },
  { out: "editorial/craft-box-ultra.jpg", src: "craft-box", crop: [0, 0.08, 1, 0.8], aspect: "ultra" },
  { out: "editorial/assorted.jpg", src: "sheet-system", ...px(SYS.assortedWide), aspect: "wide" },
  { out: "editorial/box-sizes.jpg", src: "sheet-system", ...px(SYS.boxSizes), aspect: "landscape" },
  { out: "editorial/gifting.jpg", src: "sheet-system", ...px(SYS.gifting), aspect: "landscape" },
  { out: "editorial/on-the-go.jpg", src: "sheet-system", ...px(SYS.onTheGo), aspect: "landscape" },
  { out: "editorial/signature.jpg", src: "sheet-prototype", ...px(PROTO.signature), aspect: "landscape" },
  { out: "editorial/brand-panel.jpg", src: "sheet-system", ...px(SYS.brand), aspect: "card" },

  /* ---------------------------------------------------------- box of 4
   * The Caramel Crunch Box of 4, shot on stone. Crops keep the lid logotype
   * and the tray of four cubes together wherever possible.
   */
  { out: "products/box-of-4/1.jpg", src: "box-of-4", crop: [0, 0, 1, 1], aspect: "box" },
  { out: "products/box-of-4/2.jpg", src: "box-of-4", crop: [0.42, 0.18, 0.5, 0.72], aspect: "card" },
  { out: "products/box-of-4/3.jpg", src: "box-of-4", crop: [0.08, 0.0, 0.44, 0.72], aspect: "card" },
  { out: "products/box-of-4/4.jpg", src: "box-of-4", crop: [0, 0, 1, 1], aspect: "card" },
  { out: "editorial/box-of-4.jpg", src: "box-of-4", crop: [0, 0.02, 1, 0.94], aspect: "wide" },
  { out: "editorial/box-of-4-tall.jpg", src: "box-of-4", crop: [0.22, 0, 0.62, 1], aspect: "tall" },

  /* ------------------------------------------------------- the assorted box
   * The mixed tray — one cube of each flavour, which is what "assorted" means.
   */
  { out: "products/assorted-box/1.jpg", src: "assorted-box", crop: [0, 0, 1, 1], aspect: "box" },
  { out: "products/assorted-box/2.jpg", src: "assorted-box", crop: [0.38, 0.14, 0.52, 0.78], aspect: "card" },
  { out: "products/assorted-box/3.jpg", src: "assorted-box", crop: [0.0, 0.04, 0.45, 0.72], aspect: "card" },
  { out: "products/assorted-box/4.jpg", src: "assorted-box", crop: [0, 0, 1, 1], aspect: "card" },
  { out: "editorial/assorted-box.jpg", src: "assorted-box", crop: [0, 0, 1, 1], aspect: "box" },
  /* A tighter read on the tray, so the assorted box can appear twice on a
     page without repeating the same frame. */
  { out: "editorial/assorted-box-tray.jpg", src: "assorted-box", crop: [0.26, 0.1, 0.72, 0.8], aspect: "box" },
  { out: "editorial/assorted-box-wide.jpg", src: "assorted-box", crop: [0, 0.03, 1, 0.92], aspect: "wide" },

  /* ------------------------------------------------------- made to melt
   * All four cubes melting together. The right edge is trimmed to drop the
   * generator's watermark from the corner.
   */
  { out: "editorial/made-to-melt.jpg", src: "made-to-melt", crop: [0, 0, 0.94, 1], aspect: "wide" },
  { out: "editorial/made-to-melt-ultra.jpg", src: "made-to-melt", crop: [0, 0.08, 0.94, 0.84], aspect: "ultra" },

  /* ---------------------------------------------------------- the form
   * All four cubes in one frame. Cropped long so it carries the section on
   * its own, with a 16:9 fallback for narrower screens.
   */
  { out: "editorial/the-form.jpg", src: "the-form", crop: [0, 0.26, 1, 0.62], aspect: "ultra" },
  { out: "editorial/the-form-wide.jpg", src: "the-form", crop: [0, 0.14, 1, 0.78], aspect: "wide" },

  /* ------------------------------------------------------------- footer
   * The four cubes in a row on stone. Native 8:3, so it crops to the banner
   * exactly; the tall variant carries it on narrow screens.
   */
  { out: "editorial/footer.jpg", src: "footer", crop: [0, 0, 1, 1], aspect: "ultra" },
  { out: "editorial/footer-narrow.jpg", src: "footer", crop: [0.12, 0, 0.76, 1], aspect: "wide" },

  /* ------------------------------------------------------ material section
   * A portrait macro of the embossed M. Used tall in the split panel, and
   * cropped wide where a band is needed.
   */
  { out: "editorial/material-tall.jpg", src: "material", crop: [0, 0, 1, 1], aspect: "tall" },
  { out: "editorial/material-wide.jpg", src: "material", crop: [0, 0.16, 1, 0.62], aspect: "wide" },
  /* 4:3 — matches the split panel, which is landscape once the picture takes
     the larger column. A portrait crop there loses a third of the frame. */
  { out: "editorial/material-panel.jpg", src: "material", crop: [0, 0.1, 1, 0.74], aspect: "box" },
  { out: "editorial/material-square.jpg", src: "material", crop: [0.04, 0.16, 0.92, 0.62], aspect: "card" },

  /* --------------------------------------------------- per-flavour boxes
   * One box shot per flavour, used only on the shop page. Sources differ in
   * ratio, so each crop is framed on its own box rather than shared.
   */
  { out: "boxes/classic-dark.jpg", src: "box-classic-dark", crop: [0, 0.08, 1, 0.84], aspect: "boxcard" },
  { out: "boxes/caramel-crunch.jpg", src: "box-caramel-crunch", crop: [0, 0.06, 1, 0.86], aspect: "boxcard" },
  { out: "boxes/fruit-nut.jpg", src: "box-fruit-nut", crop: [0.1, 0, 0.8, 1], aspect: "boxcard" },
  { out: "boxes/protein.jpg", src: "box-protein", crop: [0.08, 0, 0.82, 1], aspect: "boxcard" },

  /* ------------------------------------------------------- flavour posters
   * Full-bleed vertical posters, each on its own ground colour. Used whole —
   * they carry their own framing and type, so they are never cropped.
   */
  { out: "posters/classic-dark.jpg", src: "poster-classic-dark", crop: [0, 0, 1, 1], aspect: "poster" },
  { out: "posters/caramel.jpg", src: "poster-caramel", crop: [0, 0, 1, 1], aspect: "poster" },
  { out: "posters/fruit-nut.jpg", src: "poster-fruit-nut", crop: [0, 0, 1, 1], aspect: "poster" },
  { out: "posters/protein.jpg", src: "poster-protein", crop: [0, 0, 1, 1], aspect: "poster" },

  /* ------------------------------------------------------ per-flavour macros
   * Each flavour has its own full-frame macro of the cube broken open, so these
   * are true crops rather than cells enlarged out of a contact sheet.
   */
  { out: "inside/classic-dark.jpg", src: "inside-classic-dark", crop: [0, 0, 1, 1], aspect: "strip" },
  { out: "inside/caramel.jpg", src: "inside-caramel", crop: [0, 0, 1, 1], aspect: "strip" },
  { out: "inside/fruit-nut.jpg", src: "inside-fruit-nut", crop: [0, 0, 1, 1], aspect: "strip" },
  { out: "inside/protein.jpg", src: "inside-protein", crop: [0, 0, 1, 1], aspect: "strip" },

  /* Square crops of the same macros, for cards and the flavour grid. */
  { out: "inside/classic-dark-square.jpg", src: "inside-classic-dark", crop: [0.08, 0, 0.84, 1], aspect: "card" },
  { out: "inside/caramel-square.jpg", src: "inside-caramel", crop: [0.08, 0, 0.84, 1], aspect: "card" },
  { out: "inside/fruit-nut-square.jpg", src: "inside-fruit-nut", crop: [0.08, 0, 0.84, 1], aspect: "card" },
  { out: "inside/protein-square.jpg", src: "inside-protein", crop: [0.08, 0, 0.84, 1], aspect: "card" },

  /* Landscape crops for editorial modules. */
  { out: "inside/classic-dark-wide.jpg", src: "inside-classic-dark", crop: [0, 0.04, 1, 0.92], aspect: "landscape" },
  { out: "inside/caramel-wide.jpg", src: "inside-caramel", crop: [0, 0.04, 1, 0.92], aspect: "landscape" },

  /* ---------------------------------------------------------- collections */
  { out: "collections/flavours.jpg", src: "sheet-prototype", ...px(PROTO.wrappers), aspect: "wide" },
  { out: "collections/assorted.jpg", src: "open-box", crop: [0, 0, 1, 1], aspect: "wide" },
  { out: "collections/gifting.jpg", src: "sheet-system", ...px(SYS.gifting), aspect: "wide" },
  { out: "collections/everyday.jpg", src: "sheet-system", ...px(SYS.onTheGo), aspect: "wide" },

  /* ------------------------------------------------------------- journal */
  { out: "journal/the-cube.jpg", src: "sheet-prototype", ...px(PROTO.cubeCloseUp), aspect: "landscape" },
  { out: "journal/four-flavours.jpg", src: "sheet-prototype", ...px(PROTO.wrappers), aspect: "landscape" },
  { out: "journal/inside.jpg", src: "inside-caramel", crop: [0, 0.03, 1, 0.94], aspect: "landscape" },
  { out: "journal/protein.jpg", src: "sheet-system", ...px(SYS.flavourProtein), aspect: "landscape" },
  { out: "journal/gifting.jpg", src: "sheet-system", ...px(SYS.gifting), aspect: "landscape" },
  { out: "journal/bean-to-bar.jpg", src: "craft-box", crop: [0.05, 0.02, 0.9, 0.96], aspect: "landscape" },

  { out: "og.jpg", src: "open-box", crop: [0.04, 0.02, 0.92, 0.96], aspect: "og" },
];

const manifest = {};

/** Average colour of a thin strip along the region's top edge, as the backdrop. */
async function edgeColour(input, region) {
  const band = Math.max(4, Math.round(region.height * 0.08));
  const { data } = await sharp(input)
    .extract({ left: region.left, top: region.top, width: region.width, height: band })
    .resize(1, 1, { fit: "fill" })
    .raw()
    .toBuffer({ resolveWithObject: true });
  return { r: data[0], g: data[1], b: data[2] };
}

async function build(entry) {
  const [aw, ah] = A[entry.aspect];
  const input = join(SRC, `${entry.src}.png`);
  const meta = await sharp(input).metadata();

  let region;
  if (entry.px) {
    const [x, y, w, h] = entry.px;
    region = { left: x, top: y, width: w, height: h };
  } else {
    const [cx, cy, cw, ch] = entry.crop;
    region = {
      left: Math.round(cx * meta.width),
      top: Math.round(cy * meta.height),
      width: Math.round(cw * meta.width),
      height: Math.round(ch * meta.height),
    };
  }

  region.left = Math.max(0, Math.min(region.left, meta.width - 8));
  region.top = Math.max(0, Math.min(region.top, meta.height - 8));
  region.width = Math.max(8, Math.min(region.width, meta.width - region.left));
  region.height = Math.max(8, Math.min(region.height, meta.height - region.top));

  let pipe = sharp(input).extract(region);

  if (entry.contain) {
    /* Inset the panel so it sits on its own tone with room to breathe. */
    const inset = Math.round(Math.min(aw, ah) * 0.045);
    const background = await edgeColour(input, region);
    pipe = pipe
      .resize(aw - inset * 2, ah - inset * 2, { fit: "inside", kernel: "lanczos3" })
      .extend({
        top: inset,
        bottom: inset,
        left: inset,
        right: inset,
        background,
      })
      .resize(aw, ah, { fit: "contain", background, kernel: "lanczos3" });
  } else {
    pipe = pipe.resize(aw, ah, { fit: "cover", kernel: "lanczos3", position: "centre" });
  }

  const buffer = await pipe
    .sharpen({ sigma: 1.05, m1: 0.35, m2: 0.5 })
    .modulate({ saturation: 1.02 })
    .jpeg({ quality: 88, mozjpeg: true, chromaSubsampling: "4:4:4" })
    .toBuffer();

  const out = join(PUBLIC, "images", entry.out);
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, buffer);

  const blur = await sharp(buffer).resize(16).jpeg({ quality: 45 }).toBuffer();
  manifest[`/images/${entry.out}`] = {
    width: aw,
    height: ah,
    blurDataURL: `data:image/jpeg;base64,${blur.toString("base64")}`,
  };
}

const started = Date.now();
for (const entry of PLAN) {
  await build(entry);
}

const manifestPath = join(ROOT, "lib", "generated", "image-manifest.json");
await mkdir(dirname(manifestPath), { recursive: true });
await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);

console.log(`${PLAN.length} images in ${((Date.now() - started) / 1000).toFixed(1)}s`);
