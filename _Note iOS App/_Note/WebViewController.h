//
//  WebViewController.h
//  _Note
//
//  COMP 4350 - Software Development 2
//  Group 1: _Note
//

#import <UIKit/UIKit.h>

@interface WebViewController : UIViewController

@property (strong, nonatomic) IBOutlet UIWebView *web;
@property NSURLConnection *urlConnection;
@property NSURLRequest *urlRequest;
@property BOOL authenticated;

@end
