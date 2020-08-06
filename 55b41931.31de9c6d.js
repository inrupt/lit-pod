(window.webpackJsonp=window.webpackJsonp||[]).push([[9],{64:function(e,t,a){"use strict";a.r(t),a.d(t,"frontMatter",(function(){return b})),a.d(t,"metadata",(function(){return r})),a.d(t,"rightToc",(function(){return i})),a.d(t,"default",(function(){return o}));var c=a(2),l=a(6),n=(a(0),a(88)),b={id:"_acl_acl_",title:"acl/acl",sidebar_label:"acl/acl"},r={unversionedId:"api/modules/_acl_acl_",id:"api/modules/_acl_acl_",isDocsHomePage:!1,title:"acl/acl",description:'@inrupt/solid-client \u203a "acl/acl"',source:"@site/docs/api/modules/_acl_acl_.md",permalink:"/solid-client-js/docs/api/modules/_acl_acl_",editUrl:"https://github.com/inrupt/solid-client-js/edit/master/website/docs/api/modules/_acl_acl_.md",sidebar_label:"acl/acl",sidebar:"api",next:{title:"acl/agent",permalink:"/solid-client-js/docs/api/modules/_acl_agent_"}},i=[{value:"Index",id:"index",children:[{value:"Functions",id:"functions",children:[]}]},{value:"Functions",id:"functions-1",children:[{value:"createAcl",id:"createacl",children:[]},{value:"createAclFromFallbackAcl",id:"createaclfromfallbackacl",children:[]},{value:"deleteAclFor",id:"deleteaclfor",children:[]},{value:"getFallbackAcl",id:"getfallbackacl",children:[]},{value:"getResourceAcl",id:"getresourceacl",children:[]},{value:"hasFallbackAcl",id:"hasfallbackacl",children:[]},{value:"hasResourceAcl",id:"hasresourceacl",children:[]},{value:"saveAclFor",id:"saveaclfor",children:[]}]}],s={rightToc:i};function o(e){var t=e.components,a=Object(l.a)(e,["components"]);return Object(n.b)("wrapper",Object(c.a)({},s,a,{components:t,mdxType:"MDXLayout"}),Object(n.b)("p",null,Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/index"}),"@inrupt/solid-client")," \u203a ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_acl_acl_"}),'"acl/acl"')),Object(n.b)("h2",{id:"index"},"Index"),Object(n.b)("h3",{id:"functions"},"Functions"),Object(n.b)("ul",null,Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#createacl"}),"createAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#createaclfromfallbackacl"}),"createAclFromFallbackAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#deleteaclfor"}),"deleteAclFor")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#getfallbackacl"}),"getFallbackAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#getresourceacl"}),"getResourceAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasfallbackacl"}),"hasFallbackAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasresourceacl"}),"hasResourceAcl")),Object(n.b)("li",{parentName:"ul"},Object(n.b)("a",Object(c.a)({parentName:"li"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#saveaclfor"}),"saveAclFor"))),Object(n.b)("h2",{id:"functions-1"},"Functions"),Object(n.b)("h3",{id:"createacl"},"createAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"createAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"targetResource"),": ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl"),"): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L245"}),"acl/acl.ts:245"))),Object(n.b)("p",null,"Initialise an empty Resource ACL for a given Resource."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"targetResource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A Resource that does not have its own ACL yet (see ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasresourceacl"}),"hasResourceAcl"),").")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,"A Resource ACL for the given Resource, with no ACL Rules defined yet."),Object(n.b)("hr",null),Object(n.b)("h3",{id:"createaclfromfallbackacl"},"createAclFromFallbackAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"createAclFromFallbackAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withfallbackacl"}),"WithFallbackAcl")," & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl"),"): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L268"}),"acl/acl.ts:268"))),Object(n.b)("p",null,"Create a Resource ACL for a given Resource, setting the same access permissions that currently apply to it from its Container."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withfallbackacl"}),"WithFallbackAcl")," & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A Resource that does not have its own ACL (see ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasresourceacl"}),"hasResourceAcl"),") and a known fallback ACL (see ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasfallbackacl"}),"hasFallbackAcl"),").")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,"A Resource ACL for the given Resource, with the default ACL Rules from the fallback ACL applied as Resource Rules."),Object(n.b)("hr",null),Object(n.b)("h3",{id:"deleteaclfor"},"deleteAclFor"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"deleteAclFor"),"\u2039",Object(n.b)("strong",{parentName:"p"},"Resource"),"\u203a(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": Resource, ",Object(n.b)("inlineCode",{parentName:"p"},"options"),": Partial\u2039typeof internal_defaultFetchOptions\u203a): ",Object(n.b)("em",{parentName:"p"},"Promise\u2039Resource & object\u203a")),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L582"}),"acl/acl.ts:582"))),Object(n.b)("p",null,"Remove the ACL of a Resource."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Type parameters:")),Object(n.b)("p",null,"\u25aa ",Object(n.b)("strong",{parentName:"p"},"Resource"),": ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl"))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Default"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Resource"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"-"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"The Resource for which you want to delete the Access Control List Resource.")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"options")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Partial\u2039typeof internal_defaultFetchOptions\u203a"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"internal_defaultFetchOptions"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Optional parameter ",Object(n.b)("inlineCode",{parentName:"td"},"options.fetch"),": An alternative ",Object(n.b)("inlineCode",{parentName:"td"},"fetch")," function to make the HTTP request, compatible with the browser-native ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/fetch#parameters"}),"fetch API"),".")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},"Promise\u2039Resource & object\u203a")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"getfallbackacl"},"getFallbackAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"getFallbackAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withfallbackacl"}),"WithFallbackAcl"),"): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L227"}),"acl/acl.ts:227"))),Object(n.b)("p",null,"Access the fallback ACL attached to a Resource."),Object(n.b)("p",null,"Given a Resource that has a fallback ACL attached, this function will give you access to that\nACL. To verify whether the fallback ACL is available, see ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasfallbackacl"}),"hasFallbackAcl"),"."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withfallbackacl"}),"WithFallbackAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A Resource with potentially a fallback ACL attached.")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,"The fallback ACL, or null if it coult not be accessed."),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"getFallbackAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"dataset"),": WithAcl): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," | null")),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L228"}),"acl/acl.ts:228"))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"dataset")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"WithAcl")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," | null")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"getresourceacl"},"getResourceAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"getResourceAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": WithAcl & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceacl"}),"WithResourceAcl"),"): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L179"}),"acl/acl.ts:179"))),Object(n.b)("p",null,"Access the ACL attached to a Resource."),Object(n.b)("p",null,"Given a Resource that has an ACL attached, this function will give you access to that ACL. To\nverify whether the ACL is available, see ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_acl_acl_#hasresourceacl"}),"hasResourceAcl"),"."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"WithAcl & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo")," & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceacl"}),"WithResourceAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A Resource with potentially an ACL attached.")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"))),Object(n.b)("p",null,"The ACL, if available, and undefined if not."),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"getResourceAcl"),"(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": WithAcl & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo"),"): ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," | null")),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L182"}),"acl/acl.ts:182"))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"WithAcl & ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo"))))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," | null")),Object(n.b)("hr",null),Object(n.b)("h3",{id:"hasfallbackacl"},"hasFallbackAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"hasFallbackAcl"),"\u2039",Object(n.b)("strong",{parentName:"p"},"Resource"),"\u203a(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": Resource): ",Object(n.b)("em",{parentName:"p"},"resource is Resource & WithFallbackAcl")),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L209"}),"acl/acl.ts:209"))),Object(n.b)("p",null,"Verify whether a fallback ACL was found for the given Resource."),Object(n.b)("p",null,"A Resource fetched with its ACL (e.g. using ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_resource_soliddataset_#getsoliddatasetwithacl"}),"getSolidDatasetWithAcl"),") ",Object(n.b)("em",{parentName:"p"},"might")," have a fallback ACL\nattached, but we cannot be sure: the currently authenticated user (if any) might not have Control\naccess to one of the fetched Resource's Containers."),Object(n.b)("p",null,"This function verifies that the fallback ACL is accessible."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Type parameters:")),Object(n.b)("p",null,"\u25aa ",Object(n.b)("strong",{parentName:"p"},"Resource"),": ",Object(n.b)("em",{parentName:"p"},"WithAcl")),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Resource"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#soliddataset"}),"SolidDataset")," that might have a fallback ACL attached.")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},"resource is Resource & WithFallbackAcl")),Object(n.b)("p",null,"Whether ",Object(n.b)("inlineCode",{parentName:"p"},"dataset")," has a fallback ACL attached."),Object(n.b)("hr",null),Object(n.b)("h3",{id:"hasresourceacl"},"hasResourceAcl"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"hasResourceAcl"),"\u2039",Object(n.b)("strong",{parentName:"p"},"Resource"),"\u203a(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": Resource): ",Object(n.b)("em",{parentName:"p"},"resource is Resource & WithResourceAcl & WithAccessibleAcl")),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L155"}),"acl/acl.ts:155"))),Object(n.b)("p",null,"Verify whether an ACL was found for the given Resource."),Object(n.b)("p",null,"A Resource fetched with its ACL (e.g. using ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_resource_soliddataset_#getsoliddatasetwithacl"}),"getSolidDatasetWithAcl"),") ",Object(n.b)("em",{parentName:"p"},"might")," have a resource ACL attached, but\nwe cannot be sure: it might be that none exists for this specific Resource (in which case the\nfallback ACL applies), or the currently authenticated user (if any) might not have Control access\nto the fetched Resource."),Object(n.b)("p",null,"This function verifies that the Resource's ACL is accessible."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Type parameters:")),Object(n.b)("p",null,"\u25aa ",Object(n.b)("strong",{parentName:"p"},"Resource"),": ",Object(n.b)("em",{parentName:"p"},"WithAcl & ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo"))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Resource"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"A Resource that might have an ACL attached.")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},"resource is Resource & WithResourceAcl & WithAccessibleAcl")),Object(n.b)("p",null,"Whether ",Object(n.b)("inlineCode",{parentName:"p"},"dataset")," has an ACL attached."),Object(n.b)("hr",null),Object(n.b)("h3",{id:"saveaclfor"},"saveAclFor"),Object(n.b)("p",null,"\u25b8 ",Object(n.b)("strong",{parentName:"p"},"saveAclFor"),"(",Object(n.b)("inlineCode",{parentName:"p"},"resource"),": ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl"),", ",Object(n.b)("inlineCode",{parentName:"p"},"resourceAcl"),": ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset"),", ",Object(n.b)("inlineCode",{parentName:"p"},"options"),": Partial\u2039typeof internal",Object(n.b)("em",{parentName:"p"},"defaultFetchOptions\u203a): *Promise\u2039","[AclDataset]","(/solid-client-js/docs/api/modules/_interfaces"),"#acldataset) & ",Object(n.b)("a",Object(c.a)({parentName:"p"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo"),"\u203a*"),Object(n.b)("p",null,Object(n.b)("em",{parentName:"p"},"Defined in ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"https://github.com/inrupt/solid-client-js/blob/2cc6964/src/acl/acl.ts#L551"}),"acl/acl.ts:551"))),Object(n.b)("p",null,"Save the ACL for a Resource."),Object(n.b)("p",null,"Please note that the Web Access Control specification is not yet finalised, and hence, this\nfunction is still experimental and can change in a non-major release."),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Parameters:")),Object(n.b)("table",null,Object(n.b)("thead",{parentName:"table"},Object(n.b)("tr",{parentName:"thead"},Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Name"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Type"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Default"),Object(n.b)("th",Object(c.a)({parentName:"tr"},{align:null}),"Description"))),Object(n.b)("tbody",{parentName:"table"},Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resource")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withaccessibleacl"}),"WithAccessibleAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"-"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"The Resource to which the given ACL applies.")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"resourceAcl")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"-"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"An ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," whose ACL Rules will apply to ",Object(n.b)("inlineCode",{parentName:"td"},"resource"),".")),Object(n.b)("tr",{parentName:"tbody"},Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),Object(n.b)("inlineCode",{parentName:"td"},"options")),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Partial\u2039typeof internal_defaultFetchOptions\u203a"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"internal_defaultFetchOptions"),Object(n.b)("td",Object(c.a)({parentName:"tr"},{align:null}),"Optional parameter ",Object(n.b)("inlineCode",{parentName:"td"},"options.fetch"),": An alternative ",Object(n.b)("inlineCode",{parentName:"td"},"fetch")," function to make the HTTP request, compatible with the browser-native ",Object(n.b)("a",Object(c.a)({parentName:"td"},{href:"https://developer.mozilla.org/docs/Web/API/WindowOrWorkerGlobalScope/fetch#parameters"}),"fetch API"),".")))),Object(n.b)("p",null,Object(n.b)("strong",{parentName:"p"},"Returns:")," ",Object(n.b)("em",{parentName:"p"},"Promise\u2039",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#acldataset"}),"AclDataset")," & ",Object(n.b)("a",Object(c.a)({parentName:"em"},{href:"/solid-client-js/docs/api/modules/_interfaces_#withresourceinfo"}),"WithResourceInfo"),"\u203a")))}o.isMDXComponent=!0},88:function(e,t,a){"use strict";a.d(t,"a",(function(){return p})),a.d(t,"b",(function(){return d}));var c=a(0),l=a.n(c);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function b(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);t&&(c=c.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,c)}return a}function r(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?b(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):b(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,c,l=function(e,t){if(null==e)return{};var a,c,l={},n=Object.keys(e);for(c=0;c<n.length;c++)a=n[c],t.indexOf(a)>=0||(l[a]=e[a]);return l}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(c=0;c<n.length;c++)a=n[c],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(l[a]=e[a])}return l}var s=l.a.createContext({}),o=function(e){var t=l.a.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):r(r({},t),e)),a},p=function(e){var t=o(e.components);return l.a.createElement(s.Provider,{value:t},e.children)},j={inlineCode:"code",wrapper:function(e){var t=e.children;return l.a.createElement(l.a.Fragment,{},t)}},O=l.a.forwardRef((function(e,t){var a=e.components,c=e.mdxType,n=e.originalType,b=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),p=o(a),O=c,d=p["".concat(b,".").concat(O)]||p[O]||j[O]||n;return a?l.a.createElement(d,r(r({ref:t},s),{},{components:a})):l.a.createElement(d,r({ref:t},s))}));function d(e,t){var a=arguments,c=t&&t.mdxType;if("string"==typeof e||c){var n=a.length,b=new Array(n);b[0]=O;var r={};for(var i in t)hasOwnProperty.call(t,i)&&(r[i]=t[i]);r.originalType=e,r.mdxType="string"==typeof e?e:c,b[1]=r;for(var s=2;s<n;s++)b[s]=a[s];return l.a.createElement.apply(null,b)}return l.a.createElement.apply(null,a)}O.displayName="MDXCreateElement"}}]);