import { BufferAttribute, BufferGeometry } from "three";

// created by Klaus Hoffmeister under https://hofk.de/disclaim

export default function RoundGeomtryBox({ w, h, t, r, s }: { w: number, h: number, t: number, r: number, s: number }) { // width, height, thick, radius corner, smoothness

  // helper const's and let's
  const wi = w / 2 - r;		// inner width, half
  const hi = h / 2 - r;		// inner height, half 
  const w2 = w / 2;			// half width
  const h2 = h / 2;			// half height

  let ul = r / w;				// u left front side
  let ur = (w - r) / w;		// u right front side
  const vl = r / h;			// v low
  const vh = (h - r) / h;	// v high

  let phia, phib, xc, yc, uc, vc, cosa, sina, cosb, sinb;

  let positions = [];
  let uvs = [];

  // for front side
  let t2 = t / 2;			// +  half thick
  let u0 = ul;
  let u1 = ur;
  let u2 = 0;
  let u3 = 1;
  let sign = 1;

  for (let k = 0; k < 2; k++) {  // front and back side

    positions.push(

      -wi, -h2, t2, wi, -h2, t2, wi, h2, t2,
      -wi, -h2, t2, wi, h2, t2, -wi, h2, t2,
      -w2, -hi, t2, -wi, -hi, t2, -wi, hi, t2,
      -w2, -hi, t2, -wi, hi, t2, -w2, hi, t2,
      wi, -hi, t2, w2, -hi, t2, w2, hi, t2,
      wi, -hi, t2, w2, hi, t2, wi, hi, t2

    );

    uvs.push(

      u0, 0, u1, 0, u1, 1,
      u0, 0, u1, 1, u0, 1,
      u2, vl, u0, vl, u0, vh,
      u2, vl, u0, vh, u2, vh,
      u1, vl, u3, vl, u3, vh,
      u1, vl, u3, vh, u1, vh

    );

    phia = 0;

    for (let i = 0; i < s * 4; i++) {

      phib = Math.PI * 2 * (i + 1) / (4 * s);

      cosa = Math.cos(phia);
      sina = Math.sin(phia);
      cosb = Math.cos(phib);
      sinb = Math.sin(phib);

      xc = i < s || i >= 3 * s ? wi : -wi;
      yc = i < 2 * s ? hi : -hi;

      positions.push(xc, yc, t2, xc + r * cosa, yc + r * sina, t2, xc + r * cosb, yc + r * sinb, t2);

      uc = i < s || i >= 3 * s ? u1 : u0;
      vc = i < 2 * s ? vh : vl;

      uvs.push(uc, vc, uc + sign * ul * cosa, vc + vl * sina, uc + sign * ul * cosb, vc + vl * sinb);

      phia = phib;

    }

    // for back side
    t2 = -t2;	// - half thick
    u0 = ur;	// right left exchange
    u1 = ul;
    u2 = 1;
    u3 = 0;
    sign = -1;

  }

  // framing

  t2 = t / 2;	// + half thick (again)

  positions.push(

    -wi, -h2, t2, -wi, -h2, -t2, wi, -h2, -t2,
    -wi, -h2, t2, wi, -h2, -t2, wi, -h2, t2,
    w2, -hi, t2, w2, -hi, -t2, w2, hi, -t2,
    w2, -hi, t2, w2, hi, -t2, w2, hi, t2,
    wi, h2, t2, wi, h2, -t2, -wi, h2, -t2,
    wi, h2, t2, -wi, h2, -t2, -wi, h2, t2,
    -w2, hi, t2, -w2, hi, -t2, -w2, -hi, -t2,
    -w2, hi, t2, -w2, -hi, -t2, -w2, -hi, t2

  );

  const cf = 2 * ((w + h - 4 * r) + Math.PI * r); // circumference
  const cc4 = Math.PI * r / 2 / cf;  // circle-circumference / 4 / circumference
  u0 = 0;
  u1 = 2 * wi / cf;
  u2 = u1 + cc4;
  u3 = u2 + 2 * hi / cf;

  const u4 = u3 + cc4;
  const u5 = u4 + 2 * wi / cf;
  const u6 = u5 + cc4;
  const u7 = u6 + 2 * hi / cf;

  uvs.push(

    u0, 1, 0, 0, u1, 0,
    u0, 1, u1, 0, u1, 1,
    u2, 1, u2, 0, u3, 0,
    u2, 1, u3, 0, u3, 1,
    u4, 1, u4, 0, u5, 0,
    u4, 1, u5, 0, u5, 1,
    u6, 1, u6, 0, u7, 0,
    u6, 1, u7, 0, u7, 1

  );

  phia = 0;
  let u, j, j1;
  const ccs = cc4 / s; // partial value according to smoothness

  for (let i = 0; i < s * 4; i++) {

    phib = Math.PI * 2 * (i + 1) / (4 * s);

    cosa = Math.cos(phia);
    sina = Math.sin(phia);
    cosb = Math.cos(phib);
    sinb = Math.sin(phib);

    xc = i < s || i >= 3 * s ? wi : -wi;
    yc = i < 2 * s ? hi : -hi;

    positions.push(xc + r * cosa, yc + r * sina, t2, xc + r * cosa, yc + r * sina, -t2, xc + r * cosb, yc + r * sinb, -t2);
    positions.push(xc + r * cosa, yc + r * sina, t2, xc + r * cosb, yc + r * sinb, -t2, xc + r * cosb, yc + r * sinb, t2);

    u = i < s ? u3 : (i < 2 * s ? u5 : (i < 3 * s ? u7 : u1)); // Attention! different start to front/back

    j = i % s;
    j1 = j + 1;

    uvs.push(u + j * ccs, 1, u + j * ccs, 0, u + j1 * ccs, 0);
    uvs.push(u + j * ccs, 1, u + j1 * ccs, 0, u + j1 * ccs, 1);

    phia = phib;

  }

  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new BufferAttribute(new Float32Array(positions), 3));
  geometry.setAttribute("uv", new BufferAttribute(new Float32Array(uvs), 2));

  // add multimaterial groups for front, back, framing

  const vtc = (6 + 4 * s) * 3;		// vertex count one side
  geometry.addGroup(0, vtc, 0);
  geometry.addGroup(vtc, vtc, 1);
  geometry.addGroup(2 * vtc, 24 + 2 * 3 * 4 * s, 2);

  return geometry;

}