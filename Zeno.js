(function ( window, undefined ){
	var arr = [],
    push = arr.push,
    slice = arr.slice,
    concat = arr.concat

  var zeno = function zeno ( selector ){
  	return new zeno.fn.init( selector )
  }

  zeno.fn = zeno.prototype = {
  	constructor: zeno,
  	selector: null,
  	length: 0,
  	//初始化
  	init: function( selector ){
  		//为空返回this
      if ( !selector ) return this
      	//字符串
      if ( zeno.isString( selector )){
      	if ( selector.charAt(0) === '<'){
      		zeno.push.apply( this, zeno.parseHTML( selector))
      	} else {
      		zeno.push.apply( this, itcast.select( selector))
      		this.selector = selector
      	}
      	return this
      }
      //DOM对象
      if ( zeno.isDOM( selector ) ){
      	this[ 0 ] = selector
      	this.length = 1
      	return this
      }
      //zeno对象
      if ( zeno.isZeno( selector )){
      	return selector
      }
      //dom数组
      if ( zeno.usLikeArray( selector)){
      	zeno.push.apply( this, selector)
      	return this
      }
      //函数
      if ( zeno.isFunction( selector )){
      	var oldFn = window.onload
      	if ( typeof oldFn === 'function'){
      		window.onload = function (){
      			oldFn()
      			selector()
      		}
      	} else {
      		window.onload = selector
      	}
      }
  	},
  	//eack方法
  	each:function ( callback){
  		zeno.each( this, callback)
  		return this
  	}
  }

  zeno.fn.init.prototype = zeno.prototype

//扩展
  zeno.extend = zeno.fn.extend = function ( obj ){
  	var k
  	for ( k in obj ){
  		this[ k ] = obj[ k ]
  	}
  }

//选择器
var select =
    (function () {
        var each = function ( arr, fn ) {
        	var i
            for ( i = 0; i < arr.length; i++ ){
                if ( fn.call(arr[i],i,arr[i])===false ){
                    break
                }
            }
        }

        //字符串替换
        var myTrim = function (str) {
            if ( String.protptype.trim ){
                //能力判断
                return str.trim()
            } else {
                //自己的方法替换
                return str.replace(/^\s+|\s+$/g, '')
            }
        }

        //通过标签名获取元素的方法
        var getTag = function ( tag, context, results){
            results = results || []
            results.push.apply(results,context.getElementsByTagName(tag));
            return results

        }

        //通过id获取元素的方法
        var getId = function ( id, context, results){
            results = results || [] 
            results.push(document.getElementById( id ))
            return results
        }

        //通过类名获得标签的方法
        var getClass = function ( className, context, results ){
            results = results || []
            if ( document.getElementsByClassName ){
                //--------------------------能力检测待改进--------------------
                results.push.apply( results, context.getElementsByClassName( className ))
            }else{
                each( getTag('*',context), function ( i, v ){
                    if ( (' ' + v.className + ' ')
                            .indexOf( ' ' + className + ' ') != -1){
                        results.push( v )
                    }
                })
            };
            return results
        }


        //基本的获得元素的方法
        var get  = function ( selector, context, results ){
            results = results || []
            context = context || document
            var rquickExpr = /^(?:#([\w-]+)|\.([\w-]+)|([\w]+)|(\*))$/,
            //定义正则用来匹配字符串
                m = rquickExpr.exec( selector )
            if ( m ){
                if ( context.nodeType ){
                    context = [ context ]
                }
                if(typeof context == 'string'){
                    context = get( context )
                }
                each( context, function ( i, v ){
                    if ( m[ 1 ] ){
                        results = getId( m[ 1 ], results )
                    }else if( m[ 2 ] ){
                        results = getClass( m[ 2 ], v, results ) 
                    }else if( m[ 3 ] ){
                        results = getTag( m [ 3 ], this, results )
                    }else if( m [ 4 ]){
                        results = getTag( m[ 4 ], this, results )
                    }
                })
            }
            return results
        }
        //用来处理多种选择方式
        var select = function ( selector, context, results ){
            results = results || []
            var i,
            newSelectors = selector.split( ',' )
            each( newSelectors, function ( i, v) {
                var list = v.split( ' ' ),
                c = context
                for ( i = 0; i < list.length; i++){
                    if ( list[ i ] === '') continue;
                    c = get( list[ i ], c)
                }
                results.push.apply( results, c)
            })
            return results
        }


//-----------------------------------------------------------
        return select
    })()

  var parseHTML = function ( html ) {
  	var div = document.createElement( 'div' )
  		arr = [],
  		i
  		div.innerHTML = html
  		for ( i = 0; i < div.childNodes.length; i++ ){
  			arr.push( div.childNodes[ i ] )
  		}
  		return arr
  }

  zeno.extend({
  	select:select,
  	parseHTML:parseHTML
  })

  zeno.extend({
  	each: function ( arr,fn ) {
  		var i,
  		l = arr.length,
  		isArray = zeno.isLikeArray ( arr )
  		if ( isArray ) {
  			//数组
  			for (var i = 0; i < l.length; i++) {
  				if ( fn.call( arr[ i ], i, arr[ i ] ) === false ) {
  					break
  				}
  			}
  		} else {
  			//对象
  			for ( i in arr ) {
  				if ( fn.call( arr[ i ], i, arr[i] ) === false ) {
  					break
  				}
  			}
  		}
  		return arr
  	},
  	trim: function ( str ) {
  		return str.replace( /^\s+|\s+$/g, '' )
  	},
  	push:push
  })

//判断类型模块
  zeno.extend({
  	isFunction: function ( obj )\ {
  		return typeof obj === 'function'
  	},
  	isString: function ( obj ) {
  		return typeof obj === 'string'
  	},
  	isLikeArray: function ( obj ) {
  		return obj && obj.length && obj.length >= 0 
  	}
  	isZeno: function ( obj ) {
  		return 'selector' in obj;
  	},
  	isDOM: function ( obj ) {
  		return !!obj.nodeType
  	}
  })

  //DOM操作模块
  zeno.extend({
  	firstChild: function ( dom ) {
  		var node
  		node.each( dom.childNodes, function( i, v ) {
  			if ( this.nodeType === 1 ) {
  				node = this
  				return fals
  			}
  		})
  		return node
  	},
  	nextSibling: function( dom ) {
  	var newDom = dom
  	while ( newDom = newDom.nextSibling ) {
  		if ( newDom.nodeType === 1 ) {
  			return newDom
  		}
  	}
  },
  	nextAll: function ( dom ) {
  		var newDom = dom,
  		arr = [],
  		while ( newDom = newDom.nextSibling ) {
  			if ( newDom.nodeType === 1 ) {
  				arr.push( newDom )
  			}
  		}
  		return arr
  	},
  })
  
  //DOM实例方法
  zeno.fn.extend({
  	appendTo: function ( selector ) {
  		var objs = zeno( selector ),
  		i,j,
  		len1 = objs.length,
  		len2 = this.length,
  		arr = [],
  		node
  		for ( i = 0; i < len1; i++ ) {
  			for ( j = 0; j < len2; j++ ) {
  				node = i === len1 -1 ?
  				this[ j ] :
  				this[ j ].cloneNode( true )
  				arr.push( node )
  				objs[ i ].appendChild( node )
  			}
  		}
  		return zeno( arr )
  	},
  	append: function ( selector ) {
  		zeno( selector ).append( this )
  		return this
  	},
  	prependTo: function ( selector ) {
  		var objs = zeno( selector ),
  		len1 = this.length,
  		len2 = objs.length,
  		i,j,
  		for ( i = 0; i < len2; i++ )｛
  			for ( j = 0; j < len1; j++ ) { 
  				objs[ i ].insertBefore( i === len2 -1 ?
  					this[ j ]:
  					this[ j ].cloneNode( true ),
  					zeno.firstChild( objs[ i ] ))
  			}
  		}
  		return this;
  	},
  	prepend: function ( selector ) {
  		zeno( sselector ).prependTo( this )
  		return this
  	},
  	remove: function () {
  		var i,
  		len = this.length
  		for ( i = 0; i < len； i++ ) {
  			this[ i ].parentNode.removeChild( this[ i ])
  		}
  		return this
  	},
  	next: function (){
  		var arr = []
  		zeno.each( this,function( i, v ){
  			arr.push( zeno.nextSibling( v ))
  		})
  		return zeno( arr )
  	},
  	nextAll: function () {
  		var arr = []
  		zeno.each( this, function( i, v ){
  			zeno.push.apply( arr, zeno.nextAll( v ))
  		})
  		return zeno( arr )
  	},
  })

  //事件模块
  zeno.fn.extend({
  	on: function ( type, callback ) {
  		this.each( function () {
  			if ( this.addEventListener ) {
  				this.addEventListener( type, callback )
  			} else {
  				this.attachEvent( 'on' + type, callback)
  			}
  		})
  		return this
  	},
  	off: function(){
  		this.each( function( i, v ){
  			v.removeEventListener( type, callback)
  		})
  		return this
  	}
		zeno.each( ("click,mouseover,mouseout,mouseenter,mouseleave," + 
			  "mousemove,mousedown," + 
			  "mouseup,keydown,keyup" ).split(','), function ( i, v ) {
			  	
			zeno.fn[ v ] = function ( callback ) {
		return this.on( v, callback );
			}	
		})
  })
  //复杂事件
  zeno.fn.extend({
		hover: function ( fn1, fn2 ) {
  		return this.mouseover( fn1 ).mouseout( fn2 )
  	},
  	toggle: function () {
  		var args = arguments,
  		i = 0
  		return this.click( function ( e ) {
  			args[ i++ % args.length ].call( this, e )
  		}) 
  	}
  })

  //CSS模块
  zeno.fn.extend({
  	css: function ( cssName, cssValue ) {
  		if( typeof cssName == 'object' ) {
  			return this.each( function () {
  				var k 
  				for ( k in cssName ) {
  					this.style[ k ] = cssName[ K ]
  				}
  			})
  		} else if ( cssValue === undefined ) {
  			return window.getComputedStyle( this[ 0 ])[ cssName ]
  		} else {
  			return this.each( function () {
  				this.style[ cssName ] = cssValue
  			})
  		}
  	},
  	hasClass: function ( cName ) {
  		var has = false
  		zeno.each( this[ 0 ].className.split( ' ' ),function ( i, v ){
  			if ( v === cName ) {
  				has = true
  				return false
  			}
  		})
  		return has
  	},
  	addClass: function ( cName ) {
  		return this.each( function () {
  			var className = this.className
  			className += ' ' + cName
  			this.className = zeno.trim( className );
  		})
  	},
  	removeClass: function ( cName ) {
  		return this.each( function () {
  			this.className = zeno.trim((' ' + this.className + ' ')
  				.replace( ' ' + cName + ' ', ' '))
  		})
  	},
  	toggleClass: function ( cName ) {
  		if ( this.hasClass( cName )) {
  			this.removeClass( cName )
  		} else {
  			this.addClass( cName )
  		}
  	}
  })

  //属性操作模块
  zeno.fn.extend({]
  	attr: function ( attName, attValue ) {
  		if ( arguments.length == 1 ) {
  			return this[ 0 ][ attName ]
  		} else {
  			return this.each( function () {
  				this[ attName ] = attValue
  			})
  		}
  	},
  	val: function ( value ) {
  		if ( value === undefined ) {
  			return this[ 0 ].value
  		} else {
  			return this.each( function () {
  				this.value = value
  			})
  		}
  	}
  })

  //内容处理模块
  zeno.extend({
  	getInnerText: function ( dom ) {
  		var list = []
  		if ( dom.innerText !== undefined ) {
  			return dom.innerText
  		} else {
  			getTextNode( dom, list )
  			return list.join( '' )
  		}
  		function getTextNode ( dom , arr ) {
  			var i,
  			l = dom.childNodes.length,
  			node
  			for ( i = 0; i < l; i++ ){
  				node = dom.childNodes[ i ]
  				if ( node.nodeType === 3 ) {
  					arr.push( node.nodeValue )
  				} else {
  					getTextNode( node, arr )
  				}
  			}
  		}
  	},
  	setInnerText: function ( dom, str ) {
  		if ( 'innerText' in dom ) {
  			dom.innerText = str
  		} else {
  			dom.innerHTML = ''
  			dom.appendChild( document.createTextNode( str ))
  		}
  	}
  })

  zeno.fn.extend({
  	html: function ( html ) {
  		if ( html === undefined ) {
  			return this[ 0 ].innerHTML
  		} else {
  			return this.each( function (){
  				this.innerHTML = html
  			})
  		}
  	},
  	text: function ( text ) {
  		if ( text === undefined ) {
  			return zeno.getInnerText( this[ 0 ])
  		} else {
  			return this.each( function (){
  				zeno.setInnerText( this, text )
  			})
  		}
  	}
  })
	//----结束--
	window.Z = window.zeno = zeno
	
})( window )

