# 1. Overview

This document serves as a high-level description of our API Design Guidelines. The following guidelines are derived from best practices.
The examples provided in this document will follow OpenAPI 3.0 definitions in YAML.
## 2. Goals

A primary goal of these guidelines is to establish a cohesive look and feel for all Cisco product and service network APIs ("web services" herein). Additionally, we wish to instill an "API-only" development approach where all communications between separate modules must happen via APIs.

## 3 Security

## 3.1 General Rules

**3.1.1** Services MUST perform input validation on all REST request parameters
**3.1.2** Services MUST NOT accept or transmit sensitive data or user privacy data (PII) such as credentials, keys, passwords, SSN, credit card numbers, etc., in URLs.  Services SHOULD accepts and transmit such data as part of request and response entity-body data.
**3.1.3** Services MUST ensure that, for any given request, the requesting user is always authenticated and authorized to perform the requested operation.
**3.1.4** Service endpoints that respond to GET requests MUST have no business logic side affects.  This is necessary to mitigate against CSRF attacks.

### 3.2 Authentication and Authorization

**3.2.1** The REST API MUST use OAuth2 implementation for user authentication and authorization
**3.2.2** A service MUST NOT accept authentication material or authorization tokens provided as components of a request URL path or query parameters.

## 4. Object Representations

**4.1** Resource representations MUST be based on established standards when such standards exist for the resource type.
**4.2** Where resource representation standards do not apply, structured data resources MUST support update and retrieval based on JSON representations. The media type to be used in HTTP requests and responses which contain entity data in JSON format MUST be `application/json`, and optionally qualified with a `charset=UTF-8` parameter.  Absent this qualification, however, it MUST be assumed that the entity data is encoded as UTF-8.
**4.3** A resource identifier labeled "url" MUST be present in all RESTful API resource representations, the value for which MUST be the absolute and canonical URL for the resource itself.**example**:
```
{
servers:
  - url: http://api.example.com/v1
    description: Optional server description, e.g. Main (production) server
  - url: http://staging-api.example.com
    description: Optional server description, e.g. Internal staging server for testing
}
```

## 5 Request HTTP Verbs

### 5.1 POST
//TODO

## 5.2 PUT

**5.2.1** The PUT verb MAY be used in any case where a client requests the direct modification of a resource's state. Such a request MUST be idempotent with respect to the resource state. In the event that no resource exists at the given URL, the service MAY regard a PUT as a request to create such a resource at that URL, with an initial state determined by the request payload.
**5.2.2** A field omitted by a JSON representation submitted as part of a PUT request, but recognized by the server as a field of the resource that is modifiable by the client, MUST be regarded by the server as a request to remove that field from the resource if present.
**5.2.3** A field omitted by a JSON representation submitted as part of a PUT request, but recognized by the server as a field of the resource that is not modifiable by the client, MUST be regarded by the server as constituting no requested change for that field.
**5.2.4** A field included in a JSON representation submitted as part of a PUT request, but recognized  by the server as a field of the resource that is not modifiable by the client, MUST be regarded by the server as an illegal request if and only if the field value differs from the resource's current value for that field.

### 5.3 GET

**5.3.1** The GET verb MAY be used for retrieving representational state from a resource. Such a request MUST have no apparent affect on the state of the resource.  However, side effects MAY include incidental changes in state of the server, other resources, or client-invisible fields of the target resource itself, as might be expected in cases where view counts or client metrics are being tracked. &nbsp;
**5.3.2**  The GET verb MAY be used to retrieve the states of multiple resources in a single request.  The selection of resources MAY be implicit as with a GET on a collection resource, or explicit as with a GET on a collection or search resource accompanied by selection criteria as query parameters.
In response to such a request, a service SHOULD return JSON structured data containing only the [reference representation](#references) of each resource matching the request.  The service SHOULD NOT, by default, return the [narrow](#references) or [wide](#references) representational state of each resource in the response unless explicitly requested by the client through additional query parameters 3.6.3.6.

**[template](#references)**:

```
reference_representation {
    "url": uri full http
}
root {
   "items": [ 0* reference_representation ]
}
```

**5.3.3** Services MAY support pagination for GET operations on collection endpoints.  If supported, the request MUST accept limit and offset parameters where the limit is the maximum number of resource to be returned, and offset is the index within the result set of the first resource to be returned.

**template**:

```
/{service}/{version}/{collectionpath}?limit={limit}&offset={offset}
```


**example**:

```
GET /files/v3/documents?limit=25&offset=0
```
**5.3.4** When returning paginated results, a service MUST support JSON formatted responses based on the following template and field descriptions.

**[template](#references)**:

```
reference_representation {
    "url": uri full http
}
root {
   "items" [ 0* reference_representation ],
   "paging": {
        "next" : [ 0* : uri format http ],
        ?"prev" : [ 0* : uri format http ],
        ?"limit" : integer,
        ?"offset" : integer,
        ?"pages" : integer,
        ?"count" : integer
   }
}
```


The **next** field is an array in which the entry at index 0 is a URL for the immediately subsequent page, the entry at index 1 is a URL for the next subsequent page, and so on.  If present, the "next" field MUST have a length of at least 1 in any case where there exists a subsequent page in the result set, but MAY include more.  Services supporting pagination MUST support the "next" field.

The **prev** field is an array in which the entry at index 0 is a URL for the immediately previous page, the entry at index 1 is a URL for the next previous page, and so on.  If present, the "prev" field MUST have a length of at least 1 in any case where there exists a previous page in the result set, but MAY include more.  It is OPTIONAL for services supporting pagination to also support the "prev" field.

The **limit**&nbsp;field is an integer representing the maximum number of items requested by the client for the current page.  It is OPTIONAL for services supporting pagination to also support the "limit" field.

The **offset**&nbsp;field is an integer representing the 0-based index of the first item on the current page within the context of the overall requested result set.  It is OPTIONAL for services supporting pagination to also support the "offset" field.

The **pages**&nbsp;field is an integer representing the total number of pages in the paginated result set, based on the current value of "limit".  It is OPTIONAL for services supporting pagination to also support the "pages" field.

The **count** field is an integer representing the total number of elements in the collection, regardless of "offset" or "limit".  It is OPTIONAL for services supporting pagination to also support the "count" field.

**minimal example**:

```
{
    "items":
    [
        { "url": "https://widgets.example.com/files/v3/documents/234e" },
        { "url": "https://widgets.example.com/files/v3/documents/98ef" },
        { "url": "https://widgets.example.com/files/v3/documents/d4b3" }
    ],
    "paging":
    {
        "next": [ "https://widgets.example.com/files/v3/documents?limit=3&offset=9" ]
    }
}
```


**full example**:

```
{
    "items":
    [
        { "url": "https://widgets.example.com/files/v3/documents/234e" },
        { "url": "https://widgets.example.com/files/v3/documents/98ef" },
        { "url": "https://widgets.example.com/files/v3/documents/d4b3" }
    ],
    "paging":
    {
        "next":
         [
             "https://widgets.example.com/files/v3/documents?limit=3&offset=9",
             "https://widgets.example.com/files/v3/documents?limit=3&offset=12",
             "https://widgets.example.com/files/v3/documents?limit=3&offset=15"
         ],
        "prev":
         [
             "https://widgets.example.com/files/v3/documents?limit=3&offset=3",
             "https://widgets.example.com/files/v3/documents?limit=3&offset=0",
         ],
        "limit": 3,
        "offset": 6,
        "pages": 42
    }
}
```


### 5.4 DELETE

**5.4.1** The DELETE verb MUST be interpreted as a request to delete the specified resource. The request must fail in the event no resource exists with the given URL.

**5.4.2** The DELETE verb MAY be implemented as a soft delete by default. In this case, a subsequent GET request on the same resource, or any collection having contained that resource, MUST NOT return the resource unless accompanied by an include_deleted flag.

example request:

`DELETE /files/v3/documents/ab34de`

followed by:

`GET /files/v3/documents/ab34de`

fails, whereas:

`GET /files/v3/documents/ab34de?include_deleted=true`

returns the soft deleted resource, and:

`GET /files/v3/documents?include_deleted=true`

returns the contents of documents, including ab34de and all other soft deleted resources formerly contained within that collection.

**5.4.3** The POST verb MAY be used to reverse the soft-delete of a resource, using an "undelete" parameter.

example request:

`POST /files/v3/documents/ab34de?undelete=true`

**5.4.4** The DELETE verb MAY accept a "purge" parameter to infer that a delete operation MUST be irreversible.

example request:

`DELETE /files/v3/documents/ab34de?purge=true`

**5.4.5** Any entity data accompanying a DELETE request MUST be ignored by the service.

### 5.5 PATCH

**5.5.1** The PATCH verb MAY be used for submitting partial updates to a resource. A PATCH request SHOULD have a Content-Type declared as application/json-patch, and if so MUST conform to a JSON Patch document as defined in [JP]. A server MAY implement a subset of the operations defined in [JP], provided any limitations be clearly documented in the API reference.

## 6 Versioning

The versioning of REST APIs is necessary to accommodate the sometimes unavoidable introduction of non-backward compatible changes. That is, changes which are likely to break compatibility with clients developed to work with earlier versions of the API. The recommended practice for the continuous evolution of a REST API is to avoid making non-backward compatible changes, but it is practical to consider the case where necessary changes cannot meet this standard.

The following represent backward compatible API changes.

* Introduction of new URL path structures and endpoints.
* Introduction of new optional query parameters, and entity fields.
* Disregarding previously recognized query parameters and entity fields (provided the expected behavior remains consistent).
* Removal of access restrictions on existing resources.
* Introduction of support for new media types.
* Introduction of new error response keys and codes (as defined in STATUSCODES).
* Deprecation of existing error response keys and codes.

The following represent non-backward compatible API changes.

* Changes in URL path structure for previously existing resources (example).
* Introduction of new required request query parameters (example).
* Introduction of new required request entity fields (example).
* Change in expected behavior in the absence of new fields (example).
* Change in interpretation of previously recognized query parameters or entity data.
* Change in value type or format of previously recognized query parameters or entity data (example).
* New resource access restrictions due to authorization policy changes.
* Removal of previously existing resource endpoints.
* Removal of fields previously included in response entities (example).
* Rejection of previously recognized query parameters and entity fields.
* Discontinued support of previously recognized media types.
* Redefinition of existing error response keys and codes.
# References

* [RWS]	RESTful Web Services <http://shop.oreilly.com/product/9780596529260.do>.
* [ROS]	RESTful Objects Specification <http://restfulobjects.org>.
* [DISC1]	Google APIs Discovery Service <https://developers.google.com/discovery/v1/using#discovery-doc-apiproperties>.
* [DISC2]	Aggregated Service Discovery <http://tools.ietf.org/html/draft-daboo-aggregated-service-discovery-01>.
* [MIME2EXT]	Apache MIME to File Extension Mapping <shttp://svn.apache.org/repos/asf/httpd/httpd/trunk/docs/conf/mime.types>.
* [JCR]	A Language for Rules Describing JSON Content <http://tools.ietf.org/html/draft-newton-json-content-rules-00>.
* [JP]	JSON Patch <http://tools.ietf.org/html/rfc6902>.
* [URI]	URI Template <http://tools.ietf.org/html/rfc6570>.
* [HTTP]	Hypertext Transfer Protocol – HTTP/1.1 <http://www.ietf.org/rfc/rfc2616.txt>.
* [OAUTH4]	The OAuth 2.0 Authorization Framework: Bearer Token Usage <http://tools.ietf.org/html/rfc6750>.
* [RFC3986]	RFC-3986 <http://www.ietf.org/rfc/rfc3986.txt>.
* [CORS]	Cross-Origin Resource Sharing <http://www.w3.org/TR/cors/>.
* [RFC3339]	Date and Time on the Internet: Timestamps<http://www.ietf.org/rfc/rfc3339.txt>.
* [SCIMSCHEMA]	SCIM Schema <http://tools.ietf.org/html/draft-ietf-scim-core-schema>.
* [JSONPATH]	JSONPath <http://goessner.net/articles/JsonPath/>.
* [CISCO API Design Guidelines] <https://github.com/CiscoDevNet/api-design-guide/blob/master/README.md?plain=1>