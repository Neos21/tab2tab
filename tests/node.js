/** Node.js での利用サンプル・兼・動作テスト */

const tab2tab = require('../index');

// Google Spread Sheets などで書いたタブ区切りの
const inputText = `
e																8	10	11	13	c	15	d	13	p	11									
B													8	9	11											g	13	h	15	p	13	s	11	13
G										7	8	10																						
D							6	8	10																									
A				6	8	10																												
E	6	8	10																															
																																		
e	0																																	
B	1	3	4	6		6	8	9	11																									
G	2	4	5	7		7	9	10	12																									
D	3	5	6	8		8	10	11	13																									
A																																		
E	3	5	6	8		8	10	11	13																									

G											
D											
A				0	3	5					
E	0	3	5								
											
											
12
12
10
8


G	12
D	12
A	10
E	8
`;

console.log(tab2tab(inputText));
