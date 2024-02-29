import * as fs from 'fs';
import { Arr, Str } from '../src';
(async () => {
   const docsPath = process.cwd() + '/test/core';
   const testFiles = fs.readdirSync(docsPath);

   for (const testFile of testFiles) {
      if (!/\.spec\.ts$/.test(testFile)) {
         continue;
      }

      const docFile = Arr.from([]);
      const lines = fs.readFileSync(`${docsPath}/${testFile}`).toString('utf8').split('\n');

      for (let line of lines) {
         line = line.trim();
         const matched = /\s*\/{2}\s+(#+)\s+(.+)/g.exec(line);

         if (matched) {
            const hashes = matched[1];

            if (hashes.length === 1) {
               if (docFile.length) {
                  // The prvious group is end, just close it
                  docFile.push('```\n');
               }

               docFile.push(`### ${matched[2]}\n`, '```javascript');
            } else {
               const code = matched[2];
               let subComment = code.indexOf('#') === 0 ? code.substring(1).trim() : `// ${code}`;

               if (!docFile.last().includes('javascript')) {
                  subComment = `\n${subComment}`;
               }

               docFile.push(subComment);
            }
         } else if (!line.match(/^\s*\}\);\s*$/) && docFile.length) {
            const expectMatched = /\s*expect\((.+)\)\.(.+);\s*$/g.exec(line);
            const toBe = expectMatched?.[2];

            if (toBe) {
               let ret = '';
               const regex = /(toEqual)|(toBeTruthy)|(toBeFalsy)|(toThrow)|(toMatchObject)|(toHaveProperty)|(not\.toHaveProperty)|toBeInstanceOf/g;

               if (toBe.match(regex)) {
                  ret = toBe.replace(regex, '').replace(/^\s*\(|\)\s*$/g, '');

                  if (toBe.match(/toBeTruthy/g)) {
                     ret = 'true';
                  } else if (toBe.match(/toBeFalsy/g)) {
                     ret = 'false';
                  } else if (toBe.match(/toThrow/g)) {
                     expectMatched[1] = expectMatched[1].replace(/^\s*\(\)\s*\=\>\s*/, '');
                     ret = ret ? `Throw an exception which instance of ${ret}` : 'Throw an exception';
                  } else if (toBe.match(/toHaveProperty/)) {
                     const parts = ret.split(',');
                     const isNot = !!toBe.match(/not\./);

                     if (isNot) {
                        ret = parts.length > 1 ? `[ROOT].${parts[0].trim()} !== ${parts[1]}` : `[ROOT].${parts[0]} === undefined`;
                     } else {
                        ret = `[ROOT].${parts[0].trim()} === ${parts.length > 1 ? parts[1] : 'undefined'}`;
                     }
                  } else if (toBe.match(/toBeInstanceOf/)) {
                     ret = `an instanceof ${ret}`;
                  }
               }

               if (ret.indexOf('Throw') !== 0) {
                  ret = `It returns: ${ret}`;
               }

               docFile.push(`${expectMatched[1]}; // ${ret}`);
            } else {
               docFile.push(line.replace(/^-+/g, (match) => Str.repeat(' ', match.length)));
            }
         }
      }

      if (docFile.length > 1) {
         docFile.walk('last', (index: number) => {
            if (docFile[index].match(/;$/g)) {
               docFile.push('```');
            }
         });

         const outPath = `${process.cwd()}/docs`;
         const file = Str.uFirst(testFile).split('.')[0];

         if (!fs.existsSync(outPath)) {
            fs.mkdirSync(outPath, { recursive: true });
         }

         let contents = docFile.join('\n');
         const importMatched = /\s*import\s*\{\s*(.+)\s*\}/g.exec(lines[0]);

         if (importMatched?.[1]) {
            contents = '### Usage\n```javascript\nimport { ' + importMatched[1] + " } from '@maivubc/ujs';\n```\n" + contents;
         }

         fs.writeFileSync(`${outPath}/${file}.md`, `## ${file}\n${contents}`);
      }
   }
})();
