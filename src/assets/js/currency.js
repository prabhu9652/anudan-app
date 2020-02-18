/**
 * 
 *  Developer : Karthik Ramanathan, Freelancer/React JS
 * 
 *  Usage
 * 
 *  console.log(indianCurrencyInWords(500.20));
 * 
 */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.indianCurrencyInWords = factory(root);
    }
}(this, function () {
	return (f)=>{
		const _$_ebec=[" zero"," one"," two"," three"," four"," five"," six"," seven"," eight"," nine"," ten"," eleven"," twelve"," thirteen"," fourteen"," fifteen"," sixteen"," seventeen"," eighteen"," nineteen",""," twenty"," thirty"," forty"," fifty"," sixty"," seventy"," eighty"," ninety","00","0","toString","split","reverse","length","1"," hundred"," thousand"," lakh"," crore","toFixed",".","replace"," Rupees only"," paisa only"," Rupees and","exports"];

	var g,a,c,e,h;//1
	const m=[_$_ebec[0],_$_ebec[1],_$_ebec[2],_$_ebec[3],_$_ebec[4],_$_ebec[5],_$_ebec[6],_$_ebec[7],_$_ebec[8],_$_ebec[9]];//3
	const o=[_$_ebec[10],_$_ebec[11],_$_ebec[12],_$_ebec[13],_$_ebec[14],_$_ebec[15],_$_ebec[16],_$_ebec[17],_$_ebec[18],_$_ebec[19]];//4
	const n=[_$_ebec[20],_$_ebec[10],_$_ebec[21],_$_ebec[22],_$_ebec[23],_$_ebec[24],_$_ebec[25],_$_ebec[26],_$_ebec[27],_$_ebec[28]];//5
	var a=[];//6
	var d=function(s)
	{
		var p=function()
		{
			if(c[e]== 0)
			{
				a[h]= _$_ebec[20]
			}
			else 
			{
				if(c[e]== 1)
				{
					a[h]= o[c[e- 1]]
				}
				else 
				{
					a[h]= n[c[e]]
				}
				
			}
			
		}
		;//10
		a= [];if(s== _$_ebec[29]|| s== _$_ebec[30]|| parseFloat(s)== 0)
		{
			return _$_ebec[0]
		}
		//21
		var t=s[_$_ebec[31]]();//24
		g= t[_$_ebec[32]](_$_ebec[20]);c= g[_$_ebec[33]]();var r=g[_$_ebec[34]];//28
		var q=_$_ebec[20];//29
		h= 0;for(e= 0;e< r;e++)
		{
			switch(e)
			{
				case 1://33
				case 4://34
				case 6://35
				case 8:p();break//36
				case 0:if(c[e]== _$_ebec[30]|| c[e+ 1]== _$_ebec[35])
				{
					a[h]= _$_ebec[20]
				}
				else 
				{
					a[h]= m[c[e]]
				}
				//41
				a[h]= a[h]+ _$_ebec[20];break//40
				case 2:if(c[e]== _$_ebec[30])
				{
					a[h]= _$_ebec[20]
				}
				else 
				{
					if(c[e- 1]!== _$_ebec[30]&& c[e- 2]!== _$_ebec[30])
					{
						a[h]= m[c[e]]+ _$_ebec[36]
					}
					else 
					{
						a[h]= m[c[e]]+ _$_ebec[36]
					}
					
				}
				//50
				break//49
				case 3:if(c[e]== _$_ebec[30]|| c[e+ 1]== _$_ebec[35])
				{
					a[h]= _$_ebec[20]
				}
				else 
				{
					a[h]= m[c[e]]
				}
				//59
				if(c[e+ 1]!== _$_ebec[30]|| c[e]> _$_ebec[30])
				{
					a[h]= a[h]+ _$_ebec[37]
				}
				//64
				break//58
				case 5:if(c[e]== _$_ebec[30]|| c[e+ 1]== _$_ebec[35])
				{
					a[h]= _$_ebec[20]
				}
				else 
				{
					a[h]= m[c[e]]
				}
				//70
				if(c[e+ 1]!== _$_ebec[30]|| c[e]> _$_ebec[30])
				{
					a[h]= a[h]+ _$_ebec[38]
				}
				//75
				break//69
				case 7:if(c[e]== _$_ebec[30]|| c[e+ 1]== _$_ebec[35])
				{
					a[h]= _$_ebec[20]
				}
				else 
				{
					a[h]= m[c[e]]
				}
				//81
				a[h]= a[h]+ _$_ebec[39];break//80
				default:break
			}
			//32
			h++
		}
		//31
		a[_$_ebec[33]]();for(e= 0;e< a[_$_ebec[34]];e++)
		{
			q+= a[e]
		}
		//97
		return q
	}
	;//8
	f= parseFloat(f)[_$_ebec[40]](2);var b=f[_$_ebec[31]]()[_$_ebec[32]](_$_ebec[41]);//104
	var l=b[0];//105
	var k=b[1];//106
	if((parseInt(l)&&  !parseInt(k))|| (!parseInt(l)&&  !parseInt(k)))
	{
		return d(l)[_$_ebec[42]](/^\s+/,_$_ebec[20])+ _$_ebec[43]
	}
	else 
	{
		if(!parseInt(l)&& parseInt(k))
		{
			return d(k)[_$_ebec[42]](/^\s+/,_$_ebec[20])+ _$_ebec[44]
		}
		else 
		{
			return d(l)[_$_ebec[42]](/^\s+/,_$_ebec[20])+ _$_ebec[45]+ d(k)+ _$_ebec[44]
		}
		
	}
	}
}));